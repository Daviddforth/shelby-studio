import {
  LiveConfigError,
  clientIp,
  getLiveStatus,
  rateLimited,
} from "@/lib/live/server";

import { OFFLINE } from "@/lib/live/types";

import { fail, json } from "../_shared";

export const runtime = "nodejs";

/** Public: is this creator live right now, what is it called, how many are watching. */
export async function GET(request: Request) {
  if (rateLimited(`status:${clientIp(request)}`, 120, 60_000)) {
    return fail("Too many requests.", 429);
  }

  const ref = new URL(request.url).searchParams.get("ref") ?? "";

  if (!ref || ref.length > 100) return fail("Invalid request.", 400);

  try {
    return json({ success: true, ...(await getLiveStatus(ref)) });
  } catch (error) {
    if (error instanceof LiveConfigError) {
      return json({ success: true, ...OFFLINE, configured: false });
    }

    console.error("live status failed", error);

    return json({ success: true, ...OFFLINE });
  }
}
