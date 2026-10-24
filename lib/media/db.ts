import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { Pool } from "pg";

import type { MediaDetails, MediaDetailsMap } from "./types";

/**
 * Storage for media details (title, description, cover).
 *
 * - Production: Postgres through DATABASE_URL (Supabase, Neon, any Postgres).
 *   The table is created automatically on first use.
 * - Development only: when DATABASE_URL is not set, a JSON file at
 *   .data/media-details.json is used so you can try the feature without
 *   setting up a database. This fallback is never used in production.
 */

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Database is not configured. Set DATABASE_URL to save media details."
    );
  }
}

interface DetailsStore {
  getForOwner(owner: string): Promise<MediaDetailsMap>;
  upsert(owner: string, blobName: string, details: MediaDetails): Promise<void>;
  remove(owner: string, blobName: string): Promise<void>;
}

/* ---------------------------- Postgres ----------------------------- */

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS media_details (
    owner text NOT NULL,
    blob_name text NOT NULL,
    title text NOT NULL DEFAULT '',
    description text NOT NULL DEFAULT '',
    cover_blob text,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (owner, blob_name)
  )
`;

/**
 * Row-level security with no policies means nobody except the table owner
 * (our server, through DATABASE_URL) can read or write this table. This
 * matters on Supabase: tables in the public schema are otherwise reachable
 * through its built-in web API with the public "anon" key, which would let
 * anyone edit titles without a wallet signature. It is harmless elsewhere.
 */
const LOCK_TABLE = `ALTER TABLE media_details ENABLE ROW LEVEL SECURITY`;

export function sslSettings(connectionString: string) {
  // Local Postgres does not use TLS.
  if (/localhost|127\.0\.0\.1/.test(connectionString)) return undefined;

  // Strict mode: set DATABASE_CA_CERT to your provider's CA certificate (PEM)
  // to fully verify the server.
  const ca = process.env.DATABASE_CA_CERT;

  if (ca) {
    return { ca: ca.replace(/\\n/g, "\n"), rejectUnauthorized: true };
  }

  // Default: encrypted, but the server certificate is not verified, because
  // some hosts (Supabase) use a certificate authority Node does not trust.
  return { rejectUnauthorized: false };
}

function createPostgresStore(connectionString: string): DetailsStore {
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
      ready = pool
        .query(CREATE_TABLE)
        .then(() => pool.query(LOCK_TABLE))
        .then(() => undefined)
        .catch((error) => {
          ready = null;
          throw error;
        });
    }

    return ready;
  }

  return {
    async getForOwner(owner) {
      await ensureTable();

      const result = await pool.query(
        `SELECT blob_name, title, description, cover_blob
           FROM media_details WHERE owner = $1`,
        [owner]
      );

      const map: MediaDetailsMap = {};

      for (const row of result.rows) {
        map[row.blob_name] = {
          title: row.title,
          description: row.description,
          coverBlob: row.cover_blob,
        };
      }

      return map;
    },

    async upsert(owner, blobName, details) {
      await ensureTable();

      await pool.query(
        `INSERT INTO media_details (owner, blob_name, title, description, cover_blob, updated_at)
         VALUES ($1, $2, $3, $4, $5, now())
         ON CONFLICT (owner, blob_name) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           cover_blob = EXCLUDED.cover_blob,
           updated_at = now()`,
        [owner, blobName, details.title, details.description, details.coverBlob]
      );
    },

    async remove(owner, blobName) {
      await ensureTable();

      await pool.query(
        `DELETE FROM media_details WHERE owner = $1 AND blob_name = $2`,
        [owner, blobName]
      );
    },
  };
}

/* ------------------------- Dev JSON file --------------------------- */

function createFileStore(): DetailsStore {
  const file = path.join(process.cwd(), ".data", "media-details.json");

  type FileShape = Record<string, MediaDetailsMap>;

  async function read(): Promise<FileShape> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as FileShape;
    } catch {
      return {};
    }
  }

  async function write(data: FileShape) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
  }

  return {
    async getForOwner(owner) {
      return (await read())[owner] ?? {};
    },

    async upsert(owner, blobName, details) {
      const data = await read();

      data[owner] = { ...(data[owner] ?? {}), [blobName]: details };

      await write(data);
    },

    async remove(owner, blobName) {
      const data = await read();

      if (data[owner]) {
        delete data[owner][blobName];

        await write(data);
      }
    },
  };
}

/* ----------------------------- Access ------------------------------ */

let store: DetailsStore | null | undefined;

function getStore(): DetailsStore {
  if (store === undefined) {
    const url = process.env.DATABASE_URL;

    if (url) {
      store = createPostgresStore(url);
    } else if (process.env.NODE_ENV !== "production") {
      store = createFileStore();
    } else {
      store = null;
    }
  }

  if (!store) {
    throw new DatabaseNotConfiguredError();
  }

  return store;
}

/**
 * Details for every file of one owner. Never throws: when the database is
 * missing or down, public pages simply fall back to file names.
 */
export async function getDetailsForOwner(
  owner: string
): Promise<MediaDetailsMap> {
  try {
    return await getStore().getForOwner(owner);
  } catch (error) {
    if (!(error instanceof DatabaseNotConfiguredError)) {
      console.error("[media-details] Could not load details:", error);
    }

    return {};
  }
}

/** Saves details. Throws when the database is unavailable. */
export async function saveDetails(
  owner: string,
  blobName: string,
  details: MediaDetails
): Promise<void> {
  await getStore().upsert(owner, blobName, details);
}

/** Removes the details of a file that no longer exists. */
export async function removeDetails(
  owner: string,
  blobName: string
): Promise<void> {
  await getStore().remove(owner, blobName);
}
