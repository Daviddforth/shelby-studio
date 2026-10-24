import {
  LiveConfigError,
  clientIp,
  createViewerToken,
  getLiveConfig,
  getLiveStatus,
  isViewerBlocked,
  rateLimited,
  viewerKeyFor,
} from "@/lib/live/server";

import { VIEWER_NAME_MAX, cleanText, isStreamCode } from "@/lib/live/types";

import { fail, json } from "../_shared";

export const runtime = "nodejs";

/** Public: a viewer asks to join. Only works while the host is actually live. */
export async function POST(request: Request) {
  if (rateLimited(`token:${clientIp(request)}`, 30, 60_000)) {
    return fail("Too many requests. Wait a minute and try again.", 429);
  }

  let body: { code?: unknown; name?: unknown };

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  if (!isStreamCode(body.code)) return fail("Invalid live link.", 400);

  const code = body.code;

  const name = cleanText(body.name, VIEWER_NAME_MAX) || "Guest";

  try {
    const config = getLiveConfig();

    const status = await getLiveStatus(code);

    if (!status.live) return fail("This creator is not live right now.", 409);

    const viewerKey = await viewerKeyFor(request);

    if (await isViewerBlocked(code, viewerKey)) {
      return fail("The host has removed you from this live.", 403);
    }

    const token = await createViewerToken(code, name, viewerKey);

    return json({ success: true, url: config.url, token, name });
  } catch (error) {
    if (error instanceof LiveConfigError) return fail(error.message, 503);

    console.error("live token failed", error);

    return fail("Could not join the live. Try again.", 502);
  }
}
