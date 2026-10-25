import "server-only";

import { promises as fs } from "fs";
import path from "path";

import { Pool } from "pg";

import { DatabaseNotConfiguredError, sslSettings } from "@/lib/media/db";

import type { AudienceStats, PushSub, TipRecord, TipSummary } from "./types";

/**
 * Tips, follows and views. Same approach as the other tables: Postgres in
 * production, a JSON file in development when DATABASE_URL is not set.
 */

interface SocialStore {
  addTip(tip: TipRecord): Promise<boolean>;
  tipSummary(creator: string, limit: number): Promise<TipSummary>;
  setFollow(follower: string, creator: string, following: boolean): Promise<void>;
  isFollowing(follower: string, creator: string): Promise<boolean>;
  followerCount(creator: string): Promise<number>;
  following(follower: string): Promise<string[]>;
  addView(owner: string, target: string, viewer: string, day: string): Promise<void>;
  viewCounts(owner: string): Promise<Record<string, number>>;
  addPush(wallet: string, sub: PushSub): Promise<void>;
  removePush(wallet: string, endpoint: string): Promise<void>;
  /** Browsers of everyone who follows `creator` and turned notifications on. */
  pushTargets(creator: string): Promise<PushSub[]>;
  dropPush(endpoint: string): Promise<void>;
  hasPush(wallet: string, endpoint: string): Promise<boolean>;
}

const CREATE_TABLES = [
  `CREATE TABLE IF NOT EXISTS tips (
     hash text PRIMARY KEY,
     sender text NOT NULL,
     creator text NOT NULL,
     amount numeric NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS tips_creator_idx ON tips (creator, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS follows (
     follower text NOT NULL,
     creator text NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now(),
     PRIMARY KEY (follower, creator)
   )`,
  `CREATE INDEX IF NOT EXISTS follows_creator_idx ON follows (creator)`,
  `CREATE TABLE IF NOT EXISTS page_views (
     owner text NOT NULL,
     target text NOT NULL,
     viewer text NOT NULL,
     day date NOT NULL,
     PRIMARY KEY (owner, target, viewer, day)
   )`,
  `CREATE TABLE IF NOT EXISTS push_subscriptions (
     wallet text NOT NULL,
     endpoint text NOT NULL,
     p256dh text NOT NULL,
     auth text NOT NULL,
     created_at timestamptz NOT NULL DEFAULT now(),
     PRIMARY KEY (wallet, endpoint)
   )`,
];

// No policies: only our server (through DATABASE_URL) can read or write.
const LOCK_TABLES = ["tips", "follows", "page_views", "push_subscriptions"].map(
  (table) => `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`
);

function createPostgresStore(connectionString: string): SocialStore {
  const pool = new Pool({
    connectionString,
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ssl: sslSettings(connectionString),
  });

  let ready: Promise<void> | null = null;

  function ensureTables() {
    if (!ready) {
      ready = (async () => {
        for (const sql of [...CREATE_TABLES, ...LOCK_TABLES]) await pool.query(sql);
      })().catch((error) => {
        ready = null;
        throw error;
      });
    }

    return ready;
  }

  return {
    async addTip(tip) {
      await ensureTables();

      const result = await pool.query(
        `INSERT INTO tips (hash, sender, creator, amount, created_at)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (hash) DO NOTHING`,
        [tip.hash, tip.from, tip.to, tip.amount, tip.createdAt]
      );

      return (result.rowCount ?? 0) > 0;
    },

    async tipSummary(creator, limit) {
      await ensureTables();

      const totals = await pool.query(
        `SELECT count(*)::int AS n, coalesce(sum(amount), 0)::text AS total FROM tips WHERE creator = $1`,
        [creator]
      );

      const recent = await pool.query(
        `SELECT hash, sender, creator, amount::text AS amount, created_at
           FROM tips WHERE creator = $1 ORDER BY created_at DESC LIMIT $2`,
        [creator, limit]
      );

      return {
        count: totals.rows[0].n,
        total: totals.rows[0].total,
        recent: recent.rows.map((row) => ({
          hash: row.hash,
          from: row.sender,
          to: row.creator,
          amount: row.amount,
          createdAt: new Date(row.created_at).toISOString(),
        })),
      };
    },

    async setFollow(follower, creator, following) {
      await ensureTables();

      if (following) {
        await pool.query(
          `INSERT INTO follows (follower, creator) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [follower, creator]
        );
      } else {
        await pool.query(`DELETE FROM follows WHERE follower = $1 AND creator = $2`, [follower, creator]);
      }
    },

    async isFollowing(follower, creator) {
      await ensureTables();

      const result = await pool.query(`SELECT 1 FROM follows WHERE follower = $1 AND creator = $2`, [
        follower,
        creator,
      ]);

      return (result.rowCount ?? 0) > 0;
    },

    async followerCount(creator) {
      await ensureTables();

      const result = await pool.query(`SELECT count(*)::int AS n FROM follows WHERE creator = $1`, [creator]);

      return result.rows[0].n;
    },

    async following(follower) {
      await ensureTables();

      const result = await pool.query(
        `SELECT creator FROM follows WHERE follower = $1 ORDER BY created_at DESC LIMIT 200`,
        [follower]
      );

      return result.rows.map((row) => row.creator);
    },

    async addView(owner, target, viewer, day) {
      await ensureTables();

      await pool.query(
        `INSERT INTO page_views (owner, target, viewer, day) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [owner, target, viewer, day]
      );
    },

    async viewCounts(owner) {
      await ensureTables();

      const result = await pool.query(
        `SELECT target, count(*)::int AS n FROM page_views WHERE owner = $1 GROUP BY target`,
        [owner]
      );

      return Object.fromEntries(result.rows.map((row) => [row.target, row.n]));
    },

    async addPush(wallet, sub) {
      await ensureTables();

      await pool.query(
        `INSERT INTO push_subscriptions (wallet, endpoint, p256dh, auth) VALUES ($1, $2, $3, $4)
         ON CONFLICT (wallet, endpoint) DO UPDATE SET p256dh = $3, auth = $4`,
        [wallet, sub.endpoint, sub.p256dh, sub.auth]
      );
    },

    async removePush(wallet, endpoint) {
      await ensureTables();

      await pool.query(`DELETE FROM push_subscriptions WHERE wallet = $1 AND endpoint = $2`, [wallet, endpoint]);
    },

    async pushTargets(creator) {
      await ensureTables();

      const result = await pool.query(
        `SELECT DISTINCT p.endpoint, p.p256dh, p.auth
           FROM push_subscriptions p JOIN follows f ON f.follower = p.wallet
          WHERE f.creator = $1 LIMIT 2000`,
        [creator]
      );

      return result.rows.map((row) => ({ endpoint: row.endpoint, p256dh: row.p256dh, auth: row.auth }));
    },

    async dropPush(endpoint) {
      await ensureTables();

      await pool.query(`DELETE FROM push_subscriptions WHERE endpoint = $1`, [endpoint]);
    },

    async hasPush(wallet, endpoint) {
      await ensureTables();

      const result = await pool.query(`SELECT 1 FROM push_subscriptions WHERE wallet = $1 AND endpoint = $2`, [
        wallet,
        endpoint,
      ]);

      return (result.rowCount ?? 0) > 0;
    },
  };
}

interface FileShape {
  tips: TipRecord[];
  follows: Array<{ follower: string; creator: string }>;
  views: Array<{ owner: string; target: string; viewer: string; day: string }>;
  push: Array<PushSub & { wallet: string }>;
}

function createFileStore(): SocialStore {
  const file = path.join(process.cwd(), ".data", "social.json");

  async function read(): Promise<FileShape> {
    try {
      return { tips: [], follows: [], views: [], push: [], ...JSON.parse(await fs.readFile(file, "utf8")) };
    } catch {
      return { tips: [], follows: [], views: [], push: [] };
    }
  }

  async function write(data: FileShape) {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
  }

  return {
    async addTip(tip) {
      const data = await read();

      if (data.tips.some((item) => item.hash === tip.hash)) return false;

      data.tips.unshift(tip);

      await write(data);

      return true;
    },

    async tipSummary(creator, limit) {
      const mine = (await read()).tips.filter((tip) => tip.to === creator);

      return {
        count: mine.length,
        total: mine.reduce((sum, tip) => sum + BigInt(tip.amount), BigInt(0)).toString(),
        recent: mine.slice(0, limit),
      };
    },

    async setFollow(follower, creator, following) {
      const data = await read();

      data.follows = data.follows.filter((row) => !(row.follower === follower && row.creator === creator));

      if (following) data.follows.unshift({ follower, creator });

      await write(data);
    },

    async isFollowing(follower, creator) {
      return (await read()).follows.some((row) => row.follower === follower && row.creator === creator);
    },

    async followerCount(creator) {
      return (await read()).follows.filter((row) => row.creator === creator).length;
    },

    async following(follower) {
      return (await read()).follows.filter((row) => row.follower === follower).map((row) => row.creator);
    },

    async addView(owner, target, viewer, day) {
      const data = await read();

      if (data.views.some((v) => v.owner === owner && v.target === target && v.viewer === viewer && v.day === day)) {
        return;
      }

      data.views.push({ owner, target, viewer, day });

      await write(data);
    },

    async viewCounts(owner) {
      const counts: Record<string, number> = {};

      for (const view of (await read()).views) {
        if (view.owner === owner) counts[view.target] = (counts[view.target] ?? 0) + 1;
      }

      return counts;
    },

    async addPush(wallet, sub) {
      const data = await read();

      data.push = data.push.filter((row) => !(row.wallet === wallet && row.endpoint === sub.endpoint));

      data.push.push({ wallet, ...sub });

      await write(data);
    },

    async removePush(wallet, endpoint) {
      const data = await read();

      data.push = data.push.filter((row) => !(row.wallet === wallet && row.endpoint === endpoint));

      await write(data);
    },

    async pushTargets(creator) {
      const data = await read();

      const followers = new Set(data.follows.filter((row) => row.creator === creator).map((row) => row.follower));

      return data.push
        .filter((row) => followers.has(row.wallet))
        .map(({ endpoint, p256dh, auth }) => ({ endpoint, p256dh, auth }));
    },

    async dropPush(endpoint) {
      const data = await read();

      data.push = data.push.filter((row) => row.endpoint !== endpoint);

      await write(data);
    },

    async hasPush(wallet, endpoint) {
      return (await read()).push.some((row) => row.wallet === wallet && row.endpoint === endpoint);
    },
  };
}

let store: SocialStore | null | undefined;

function getStore(): SocialStore {
  if (store === undefined) {
    const url = process.env.DATABASE_URL;

    if (url) store = createPostgresStore(url);
    else if (process.env.NODE_ENV !== "production") store = createFileStore();
    else store = null;
  }

  if (!store) throw new DatabaseNotConfiguredError();

  return store;
}

const EMPTY_TIPS: TipSummary = { count: 0, total: "0", recent: [] };

/** Public pages call these: they never throw, they just show zeros. */
export async function getTipSummary(creator: string, limit = 8): Promise<TipSummary> {
  try {
    return await getStore().tipSummary(creator, limit);
  } catch {
    return EMPTY_TIPS;
  }
}

export async function getFollowerCount(creator: string): Promise<number> {
  try {
    return await getStore().followerCount(creator);
  } catch {
    return 0;
  }
}

export async function getViewCounts(owner: string): Promise<Record<string, number>> {
  try {
    return await getStore().viewCounts(owner);
  } catch {
    return {};
  }
}

export async function getAudienceStats(owner: string): Promise<AudienceStats> {
  const [tips, followers, views] = await Promise.all([
    getTipSummary(owner, 0),
    getFollowerCount(owner),
    getViewCounts(owner),
  ]);

  return {
    views: Object.values(views).reduce((sum, n) => sum + n, 0),
    followers,
    tipCount: tips.count,
    tipTotal: tips.total,
  };
}

/** Writers throw when the database is unavailable. */
export const social = {
  addTip: (tip: TipRecord) => getStore().addTip(tip),
  setFollow: (follower: string, creator: string, following: boolean) =>
    getStore().setFollow(follower, creator, following),
  isFollowing: (follower: string, creator: string) => getStore().isFollowing(follower, creator),
  following: (follower: string) => getStore().following(follower),
  addView: (owner: string, target: string, viewer: string, day: string) =>
    getStore().addView(owner, target, viewer, day),
  addPush: (wallet: string, sub: PushSub) => getStore().addPush(wallet, sub),
  removePush: (wallet: string, endpoint: string) => getStore().removePush(wallet, endpoint),
  pushTargets: (creator: string) => getStore().pushTargets(creator),
  dropPush: (endpoint: string) => getStore().dropPush(endpoint),
  hasPush: (wallet: string, endpoint: string) => getStore().hasPush(wallet, endpoint),
};
