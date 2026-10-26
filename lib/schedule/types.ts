export const SCHEDULE_TITLE_MAX = 80;
export const SCHEDULE_PER_CREATOR = 5;
export const SCHEDULE_MAX_AHEAD_MS = 30 * 24 * 3600_000;
/** A scheduled live stays listed for this long after its start time. */
export const SCHEDULE_GRACE_MS = 2 * 3600_000;

export const SCHEDULE_ID_RE = /^[0-9a-f]{8}$/;

export interface ScheduledLive {
  id: string;
  owner: string;
  title: string;
  /** ISO time. */
  startsAt: string;
}

export function newScheduleId(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const scheduleFields = (id: string, title: string, startsAt: string) => [id, title, startsAt];

export function cleanSchedule(
  input: { title?: unknown; startsAt?: unknown },
  now = Date.now()
): { ok: true; title: string; startsAt: string } | { ok: false; error: string } {
  if (typeof input.title !== "string" || typeof input.startsAt !== "string") return { ok: false, error: "Missing fields." };

  const title = input.title.replace(/\s+/g, " ").trim();

  if (!title) return { ok: false, error: "Give your live a title." };

  if (title.length > SCHEDULE_TITLE_MAX) return { ok: false, error: `The title can be up to ${SCHEDULE_TITLE_MAX} characters.` };

  if (/[\u0000-\u001f\u007f]/.test(title)) return { ok: false, error: "The title has unsupported characters." };

  const time = new Date(input.startsAt).getTime();

  if (!Number.isFinite(time)) return { ok: false, error: "Pick a valid date and time." };

  if (time < now - 5 * 60_000) return { ok: false, error: "That time has already passed." };

  if (time > now + SCHEDULE_MAX_AHEAD_MS) return { ok: false, error: "You can schedule up to 30 days ahead." };

  return { ok: true, title, startsAt: new Date(time).toISOString() };
}

export const isUpcoming = (live: { startsAt: string }, now = Date.now()) =>
  new Date(live.startsAt).getTime() > now - SCHEDULE_GRACE_MS;
