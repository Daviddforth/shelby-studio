import "server-only";

import { safeDocs } from "@/lib/store/docs";

import type { WatchStat } from "./types";

/** Watch time per file for one creator, keyed by file name. */
export async function getWatchStats(owner: string): Promise<Record<string, WatchStat>> {
  const found = await safeDocs.list<{ seconds?: number; plays?: number }>("watch", owner.toLowerCase(), 500);

  return Object.fromEntries(
    found.map((doc) => [doc.id, { seconds: Number(doc.data.seconds ?? 0), plays: Number(doc.data.plays ?? 0) }])
  );
}

export async function getWatchTotals(owner: string): Promise<{ seconds: number; plays: number }> {
  const stats = Object.values(await getWatchStats(owner));

  return {
    seconds: stats.reduce((sum, stat) => sum + stat.seconds, 0),
    plays: stats.reduce((sum, stat) => sum + stat.plays, 0),
  };
}
