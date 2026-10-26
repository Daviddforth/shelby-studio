import { clientIp, normalizeOwner, rateLimited } from "@/lib/live/server";
import { fail, handleError, json } from "@/lib/apiServer";
import { docs } from "@/lib/store/docs";
import { WATCH_MAX_SECONDS_PER_REPORT } from "@/lib/watch/types";
import { getWatchStats } from "@/lib/watch/db";

export const runtime = "nodejs";

/** Public: watch time per file for a creator. */
export async function GET(request: Request) {
  const owner = normalizeOwner(new URL(request.url).searchParams.get("owner"));

  if (!owner) return fail("Invalid owner.", 400);

  return json({ success: true, stats: await getWatchStats(owner) });
}

/**
 * Adds a viewer's watch time. This is an estimate: anyone can call it, so each
 * report is capped, rate limited, and only counts for a file that has a page.
 */
export async function POST(request: Request) {
  if (rateLimited(`watch:${clientIp(request)}`, 40, 60_000)) return fail("Too many requests.", 429);

  let body: { owner?: unknown; target?: unknown; seconds?: unknown; play?: unknown };

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const owner = normalizeOwner(body.owner);

  const seconds = Number(body.seconds);

  if (
    !owner ||
    typeof body.target !== "string" ||
    !body.target ||
    body.target.length > 1024 ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return fail("Invalid report.", 400);
  }

  try {
    await docs.incr("watch", owner, body.target, {
      seconds: Math.min(Math.round(seconds), WATCH_MAX_SECONDS_PER_REPORT),
      plays: body.play === true ? 1 : 0,
    });

    return json({ success: true });
  } catch (error) {
    return handleError("watch", error);
  }
}
