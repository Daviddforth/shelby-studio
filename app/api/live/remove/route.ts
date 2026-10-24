import {
  LiveConfigError,
  clientIp,
  hostFromToken,
  rateLimited,
  removeViewer,
} from "@/lib/live/server";

import { isViewerIdentity } from "@/lib/live/types";

import { fail, json } from "../_shared";

export const runtime = "nodejs";

/** Host-only: remove a viewer from the stream, and optionally keep them out. */
export async function POST(request: Request) {
  if (rateLimited(`remove:${clientIp(request)}`, 60, 60_000)) {
    return fail("Too many requests.", 429);
  }

  const header = request.headers.get("authorization") ?? "";

  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) return fail("Missing host token.", 401);

  let body: { identity?: unknown; block?: unknown };

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  if (typeof body.identity !== "string" || !isViewerIdentity(body.identity) || body.identity.length > 80) {
    return fail("Invalid viewer.", 400);
  }

  try {
    const host = await hostFromToken(token);

    if (!host) return fail("Invalid host token.", 401);

    await removeViewer(host.code, body.identity, body.block === true);

    return json({ success: true });
  } catch (error) {
    if (error instanceof LiveConfigError) return fail(error.message, 503);

    console.error("live remove failed", error);

    return fail("Could not remove that viewer.", 502);
  }
}
