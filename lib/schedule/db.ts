import "server-only";

import { safeDocs } from "@/lib/store/docs";

import { isUpcoming, type ScheduledLive } from "./types";

interface Stored {
  title: string;
  startsAt: string;
}

const toLive = (doc: { id: string; scope: string; data: Stored }): ScheduledLive => ({
  id: doc.id,
  owner: doc.scope,
  title: doc.data.title,
  startsAt: doc.data.startsAt,
});

const soonestFirst = (a: ScheduledLive, b: ScheduledLive) => a.startsAt.localeCompare(b.startsAt);

export async function upcomingFor(owner: string): Promise<ScheduledLive[]> {
  return (await safeDocs.list<Stored>("schedule", owner, 20)).map(toLive).filter((l) => isUpcoming(l)).sort(soonestFirst);
}

export async function upcomingEverywhere(limit = 12): Promise<ScheduledLive[]> {
  return (await safeDocs.listKind<Stored>("schedule", 300))
    .map(toLive)
    .filter((l) => isUpcoming(l))
    .sort(soonestFirst)
    .slice(0, limit);
}
