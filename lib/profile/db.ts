import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { Pool } from "pg";

import { DatabaseNotConfiguredError, sslSettings } from "@/lib/media/db";

import type { ProfileData } from "./types";

/**
 * Storage for creator profiles. Same approach as media details: Postgres
 * through DATABASE_URL in production; a JSON file in development when it is
 * not set. Never used as a fallback in production.
 */

interface ProfileStore {
  count(): Promise<number>;
  get(owner: string): Promise<ProfileData | null>;
  upsert(owner: string, profile: ProfileData): Promise<void>;
}

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS creator_profiles (
    owner text PRIMARY KEY,
    display_name text NOT NULL DEFAULT '',
    bio text NOT NULL DEFAULT '',
    website text NOT NULL DEFAULT '',
    twitter text NOT NULL DEFAULT '',
    github text NOT NULL DEFAULT '',
    avatar_blob text,
    updated_at timestamptz NOT NULL DEFAULT now()
  )
`;

// No policies: only our server (through DATABASE_URL) can read or write. See media/db.ts.
const LOCK_TABLE = `ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY`;

function createPostgresStore(connectionString: string): ProfileStore {
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
    async count() {
      await ensureTable();

      const result = await pool.query(`SELECT count(*)::int AS n FROM creator_profiles`);

      return result.rows[0].n;
    },

    async get(owner) {
      await ensureTable();

      const result = await pool.query(
        `SELECT display_name, bio, website, twitter, github, avatar_blob
           FROM creator_profiles WHERE owner = $1`,
        [owner]
      );

      const row = result.rows[0];

      if (!row) return null;

      return {
        displayName: row.display_name,
        bio: row.bio,
        website: row.website,
        twitter: row.twitter,
        github: row.github,
        avatarBlob: row.avatar_blob,
      };
    },

    async upsert(owner, profile) {
      await ensureTable();

      await pool.query(
        `INSERT INTO creator_profiles
           (owner, display_name, bio, website, twitter, github, avatar_blob, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, now())
         ON CONFLICT (owner) DO UPDATE SET
           display_name = EXCLUDED.display_name,
           bio = EXCLUDED.bio,
           website = EXCLUDED.website,
           twitter = EXCLUDED.twitter,
           github = EXCLUDED.github,
           avatar_blob = EXCLUDED.avatar_blob,
           updated_at = now()`,
        [
          owner,
          profile.displayName,
          profile.bio,
          profile.website,
          profile.twitter,
          profile.github,
          profile.avatarBlob,
        ]
      );
    },
  };
}

function createFileStore(): ProfileStore {
  const file = path.join(process.cwd(), ".data", "creator-profiles.json");

  async function read(): Promise<Record<string, ProfileData>> {
    try {
      return JSON.parse(await fs.readFile(file, "utf8"));
    } catch {
      return {};
    }
  }

  return {
    async count() {
      return Object.keys(await read()).length;
    },

    async get(owner) {
      return (await read())[owner] ?? null;
    },

    async upsert(owner, profile) {
      const data = await read();

      data[owner] = profile;

      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
    },
  };
}

let store: ProfileStore | null | undefined;

function getStore(): ProfileStore {
  if (store === undefined) {
    const url = process.env.DATABASE_URL;

    if (url) store = createPostgresStore(url);
    else if (process.env.NODE_ENV !== "production") store = createFileStore();
    else store = null;
  }

  if (!store) throw new DatabaseNotConfiguredError();

  return store;
}

/** Never throws: pages simply fall back to the wallet address. */
export async function getProfile(owner: string): Promise<ProfileData | null> {
  try {
    return await getStore().get(owner);
  } catch (error) {
    if (!(error instanceof DatabaseNotConfiguredError)) {
      console.error("[profile] Could not load profile:", error);
    }

    return null;
  }
}

/** Throws when the database is unavailable. */
export async function saveProfile(owner: string, profile: ProfileData): Promise<void> {
  await getStore().upsert(owner, profile);
}

/** Number of saved creator profiles, or null when the database is unavailable. */
export async function countProfiles(): Promise<number | null> {
  try {
    return await getStore().count();
  } catch {
    return null;
  }
}
