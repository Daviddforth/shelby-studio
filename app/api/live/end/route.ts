import {
  LiveConfigError,
  endRoom,
  ownerFromHostToken,
} from "@/lib/live/server";

import { fail, json } from "../_shared";

export const runtime = "nodejs";

/** Host-only: the Bearer token from /api/live/start proves who is ending the live. */
export async function POST(request: Request) {
  const header = request.headers.get("authorization") ?? "";

  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token) return fail("Missing host token.", 401);

  try {
    const owner = await ownerFromHostToken(token);

    if (!owner) return fail("Invalid host token.", 401);

    await endRoom(owner);

    return json({ success: true });
  } catch (error) {
    if (error instanceof LiveConfigError) return fail(error.message, 503);

    return fail("Could not end the live.", 502);
  }
}
