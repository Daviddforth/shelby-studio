import { SignatureError, verifyWalletMessage } from "@/lib/media/auth";

import {
  LiveConfigError,
  clientIp,
  createHostToken,
  getLiveConfig,
  getLiveStatus,
  normalizeOwner,
  rateLimited,
  startRoom,
} from "@/lib/live/server";

import {
  LIVE_SIGNATURE_MAX_AGE_MS,
  LIVE_TITLE_MAX,
  buildLiveMessage,
  cleanText,
  type StartLiveRequest,
} from "@/lib/live/types";

import { fail, json } from "../_shared";

export const runtime = "nodejs";

/** Owner-only: prove wallet ownership, open the room, get a host token. */
export async function POST(request: Request) {
  if (rateLimited(`start:${clientIp(request)}`, 10, 60_000)) {
    return fail("Too many attempts. Wait a minute and try again.", 429);
  }

  let body: Partial<StartLiveRequest>;

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const owner = normalizeOwner(body.owner);

  if (!owner) return fail("Invalid wallet address.", 400);

  if (typeof body.title !== "string" || body.title.length > LIVE_TITLE_MAX * 2) {
    return fail("Invalid title.", 400);
  }

  const title = cleanText(body.title, LIVE_TITLE_MAX);

  if (title !== body.title) {
    return fail("Title has unsupported characters or is too long.", 400);
  }

  try {
    await verifyWalletMessage(
      body as StartLiveRequest,
      buildLiveMessage(body.owner as string, title, body.issuedAt as string),
      Date.now(),
      LIVE_SIGNATURE_MAX_AGE_MS
    );
  } catch (error) {
    if (error instanceof SignatureError) return fail(error.message, 401);

    return fail("Could not verify your wallet.", 401);
  }

  try {
    const config = getLiveConfig();

    await startRoom(owner, title);

    const token = await createHostToken(owner);

    return json({ success: true, url: config.url, token, owner, title });
  } catch (error) {
    if (error instanceof LiveConfigError) return fail(error.message, 503);

    console.error("live start failed", error);

    return fail("Could not start the live. Try again.", 502);
  }
}

// Kept so a host reloading the page can tell if their room is still open.
export async function GET(request: Request) {
  const owner = normalizeOwner(new URL(request.url).searchParams.get("owner"));

  if (!owner) return fail("Invalid wallet address.", 400);

  try {
    return json({ success: true, ...(await getLiveStatus(owner)) });
  } catch (error) {
    if (error instanceof LiveConfigError) return fail(error.message, 503);

    return fail("Could not check the live.", 502);
  }
}
