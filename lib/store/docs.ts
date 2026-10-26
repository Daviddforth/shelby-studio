import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { Pool } from "pg";

import { DatabaseNotConfiguredError, sslSettings } from "@/lib/media/db";

/**
 * A small document store used by collections, paid files, comments, schedules,
 * watch time and Telegram links. Every document has a kind (what it is), a scope
 * (who or what it belongs to) and an id. Postgres in production through
 * DATABASE_URL; a JSON file in development. Never a file in production.
 */

export interface StoredDoc<T = Record<string, unknown>> {
  kind: string;
  scope: string;
  id: string;
  data: T;
  createdAt: string;
}

interface DocStore {
  put(kind: string, scope: string, id: string, data: object): Promise<void>;
  get(kind: string, scope: string, id: string): Promise<StoredDoc | null>;
  del(kind: string, scope: string, id: string): Promise<void>;
  list(kind: string, scope: string, limit: number): Promise<StoredDoc[]>;
  listKind(kind: string, limit: number): Promise<StoredDoc[]>;
  incr(kind: string, scope: string, id: string, fields: Record<string, number>): Promise<void>;
}

const NAME = /^[a-z][a-z0-9_]{0,31}$/;

function checkFields(fields: Record<string, number>) {
  for (const [key, value] of Object.entries(fields)) {
    if (!NAME.test(key) || !Number.isFinite(value)) throw new Error("Invalid counter.");
  }
}

function createPostgresStore(connectionString: string): DocStore {
  const pool = new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ssl: sslSettings(connectionString),
  });

  let ready: Promise<void> | null = null;

  function ensureTable() {
    if (!ready) {
      ready = (async () => {
        await pool.query(`CREATE TABLE IF NOT EXISTS studio_docs (
          kind text NOT NULL,
          scope text NOT NULL,
          id text NOT NULL,
          data jsonb NOT NULL DEFAULT '{}'::jsonb,
          created_at timestamptz NOT NULL DEFAULT now(),
          PRIMARY KEY (kind, scope, id)
        )`);
        await pool.query(`CREATE INDEX IF NOT EXISTS studio_docs_scope_idx ON studio_docs (kind, scope, created_at DESC)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS studio_docs_kind_idx ON studio_docs (kind, created_at DESC)`);
        // No policies: only our server (through DATABASE_URL) can read or write.
        await pool.query(`ALTER TABLE studio_docs ENABLE ROW LEVEL SECURITY`);
      })().catch((error) => {
        ready = null;
        throw error;
      });
    }

    return ready;
  }

  const toDoc = (row: { kind: string; scope: string; id: string; data: Record<string, unknown>; created_at: Date }): StoredDoc => ({
    kind: row.kind,
    scope: row.scope,
    id: row.id,
    data: row.data,
    createdAt: new Date(row.created_at).toISOString(),
  });

  return {
    async put(kind, scope, id, data) {
      await ensureTable();

      await pool.query(
        `INSERT INTO studio_docs (kind, scope, id, data) VALUES ($1, $2, $3, $4)
         ON CONFLICT (kind, scope, id) DO UPDATE SET data = $4`,
        [kind, scope, id, JSON.stringify(data)]
      );
    },

    async get(kind, scope, id) {
      await ensureTable();

      const result = await pool.query(`SELECT * FROM studio_docs WHERE kind = $1 AND scope = $2 AND id = $3`, [
        kind,
        scope,
        id,
      ]);

      return result.rows[0] ? toDoc(result.rows[0]) : null;
    },

    async del(kind, scope, id) {
      await ensureTable();

      await pool.query(`DELETE FROM studio_docs WHERE kind = $1 AND scope = $2 AND id = $3`, [kind, scope, id]);
    },

    async list(kind, scope, limit) {
      await ensureTable();

      const result = await pool.query(
        `SELECT * FROM studio_docs WHERE kind = $1 AND scope = $2 ORDER BY created_at DESC LIMIT $3`,
        [kind, scope, limit]
      );

      return result.rows.map(toDoc);
    },

    async listKind(kind, limit) {
      await ensureTable();

      const result = await pool.query(`SELECT * FROM studio_docs WHERE kind = $1 ORDER BY created_at DESC LIMIT $2`, [
        kind,
        limit,
      ]);

      return result.rows.map(toDoc);
    },

    async incr(kind, scope, id, fields) {
      checkFields(fields);

      await ensureTable();

      const keys = Object.keys(fields);

      // One atomic statement, so two viewers at once never lose a count.
      const initial = JSON.stringify(fields);

      const sets = keys
        .map(
          (key, index) =>
            `'${key}', coalesce((studio_docs.data->>'${key}')::numeric, 0) + $${index + 4}::numeric`
        )
        .join(", ");

      await pool.query(
        `INSERT INTO studio_docs (kind, scope, id, data) VALUES ($1, $2, $3, $${keys.length + 4}::jsonb)
         ON CONFLICT (kind, scope, id) DO UPDATE SET data = studio_docs.data || jsonb_build_object(${sets})`,
        [kind, scope, id, ...keys.map((key) => fields[key]), initial]
      );
    },
  };
}

function createFileStore(): DocStore {
  const file = path.join(process.cwd(), ".data", "docs.json");

  async function read(): Promise<StoredDoc[]> {
    try {
      const parsed = JSON.parse(await fs.readFile(file, "utf8"));

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  async function write(docs: StoredDoc[]) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(docs, null, 2), "utf8");
  }

  const same = (doc: StoredDoc, kind: string, scope: string, id: string) =>
    doc.kind === kind && doc.scope === scope && doc.id === id;

  const newest = (a: StoredDoc, b: StoredDoc) => b.createdAt.localeCompare(a.createdAt);

  return {
    async put(kind, scope, id, data) {
      const docs = await read();

      const existing = docs.find((doc) => same(doc, kind, scope, id));

      if (existing) existing.data = data as Record<string, unknown>;
      else docs.push({ kind, scope, id, data: data as Record<string, unknown>, createdAt: new Date().toISOString() });

      await write(docs);
    },

    async get(kind, scope, id) {
      return (await read()).find((doc) => same(doc, kind, scope, id)) ?? null;
    },

    async del(kind, scope, id) {
      await write((await read()).filter((doc) => !same(doc, kind, scope, id)));
    },

    async list(kind, scope, limit) {
      return (await read())
        .filter((doc) => doc.kind === kind && doc.scope === scope)
        .sort(newest)
        .slice(0, limit);
    },

    async listKind(kind, limit) {
      return (await read())
        .filter((doc) => doc.kind === kind)
        .sort(newest)
        .slice(0, limit);
    },

    async incr(kind, scope, id, fields) {
      checkFields(fields);

      const docs = await read();

      let doc = docs.find((item) => same(item, kind, scope, id));

      if (!doc) {
        doc = { kind, scope, id, data: {}, createdAt: new Date().toISOString() };
        docs.push(doc);
      }

      for (const [key, value] of Object.entries(fields)) {
        doc.data[key] = Number(doc.data[key] ?? 0) + value;
      }

      await write(docs);
    },
  };
}

let store: DocStore | null | undefined;

function getStore(): DocStore {
  if (store === undefined) {
    const url = process.env.DATABASE_URL;

    if (url) store = createPostgresStore(url);
    else if (process.env.NODE_ENV !== "production") store = createFileStore();
    else store = null;
  }

  if (!store) throw new DatabaseNotConfiguredError();

  return store;
}

/** Writers throw when the database is unavailable. */
export const docs = {
  put: async (kind: string, scope: string, id: string, data: object) => getStore().put(kind, scope, id, data),
  get: async <T>(kind: string, scope: string, id: string) =>
    getStore().get(kind, scope, id) as Promise<StoredDoc<T> | null>,
  del: async (kind: string, scope: string, id: string) => getStore().del(kind, scope, id),
  list: async <T>(kind: string, scope: string, limit = 100) =>
    getStore().list(kind, scope, limit) as Promise<StoredDoc<T>[]>,
  listKind: async <T>(kind: string, limit = 200) => getStore().listKind(kind, limit) as Promise<StoredDoc<T>[]>,
  incr: async (kind: string, scope: string, id: string, fields: Record<string, number>) =>
    getStore().incr(kind, scope, id, fields),
};

/** For public pages: never throws, just returns nothing when the database is missing. */
export const safeDocs = {
  async get<T>(kind: string, scope: string, id: string): Promise<StoredDoc<T> | null> {
    try {
      return await docs.get<T>(kind, scope, id);
    } catch {
      return null;
    }
  },

  async list<T>(kind: string, scope: string, limit = 100): Promise<StoredDoc<T>[]> {
    try {
      return await docs.list<T>(kind, scope, limit);
    } catch {
      return [];
    }
  },

  async listKind<T>(kind: string, limit = 200): Promise<StoredDoc<T>[]> {
    try {
      return await docs.listKind<T>(kind, limit);
    } catch {
      return [];
    }
  },
};
