import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { Pool } from "pg";

import { DatabaseNotConfiguredError, sslSettings } from "@/lib/media/db";

import type { ReportInput, ReportRecord } from "./types";

interface ReportStore {
  add(report: ReportRecord): Promise<void>;
  list(limit: number): Promise<ReportRecord[]>;
  markReviewed(id: string): Promise<void>;
}

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS reports (
    id text PRIMARY KEY,
    kind text NOT NULL,
    target text NOT NULL,
    reason text NOT NULL,
    details text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'open',
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

// No policies: only our server (through DATABASE_URL) can read or write.
const LOCK_TABLE = `ALTER TABLE reports ENABLE ROW LEVEL SECURITY`;

function createPostgresStore(connectionString: string): ReportStore {
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
    async add(report) {
      await ensureTable();

      await pool.query(
        `INSERT INTO reports (id, kind, target, reason, details, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [report.id, report.kind, report.target, report.reason, report.details, report.status, report.createdAt]
      );
    },

    async list(limit) {
      await ensureTable();

      const result = await pool.query(
        `SELECT id, kind, target, reason, details, status, created_at
           FROM reports ORDER BY (status = 'open') DESC, created_at DESC LIMIT $1`,
        [limit]
      );

      return result.rows.map((row) => ({
        id: row.id,
        kind: row.kind,
        target: row.target,
        reason: row.reason,
        details: row.details,
        status: row.status,
        createdAt: new Date(row.created_at).toISOString(),
      }));
    },

    async markReviewed(id) {
      await ensureTable();

      await pool.query(`UPDATE reports SET status = 'reviewed' WHERE id = $1`, [id]);
    },
  };
}

function createFileStore(): ReportStore {
  const file = path.join(process.cwd(), ".data", "reports.json");

  async function read(): Promise<ReportRecord[]> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      return [];
    }
  }

  async function write(items: ReportRecord[]) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(items, null, 2), "utf8");
  }

  return {
    async add(report) {
      await write([report, ...(await read())]);
    },

    async list(limit) {
      return (await read()).slice(0, limit);
    },

    async markReviewed(id) {
      await write((await read()).map((r) => (r.id === id ? { ...r, status: "reviewed" as const } : r)));
    },
  };
}

let store: ReportStore | null | undefined;

function getStore(): ReportStore {
  if (store === undefined) {
    const url = process.env.DATABASE_URL;

    if (url) store = createPostgresStore(url);
    else if (process.env.NODE_ENV !== "production") store = createFileStore();
    else store = null;
  }

  if (!store) throw new DatabaseNotConfiguredError();

  return store;
}

export async function addReport(input: ReportInput): Promise<void> {
  await getStore().add({
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "open",
  });
}

export async function listReports(limit = 200): Promise<ReportRecord[]> {
  return getStore().list(limit);
}

export async function markReportReviewed(id: string): Promise<void> {
  await getStore().markReviewed(id);
}
