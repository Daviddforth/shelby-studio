import { AccountAddress } from "@aptos-labs/ts-sdk";

import { clientIp, rateLimited } from "@/lib/live/server";
import { SignatureError, verifyWalletMessage } from "@/lib/media/auth";
import { DatabaseNotConfiguredError } from "@/lib/media/db";
import { existingCover } from "@/lib/media/server";
import { sha256Hex } from "@/lib/media/types";
import { getProfile, saveProfile } from "@/lib/profile/db";

import {
  buildProfileMessage,
  canonicalProfile,
  sanitizeProfile,
  type SaveProfileRequest,
} from "@/lib/profile/types";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function fail(message: string, status: number) {
  return json({ success: false, error: message }, status);
}

/** Public: one creator's profile (or null). */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("owner");

  if (!raw) return fail("owner is required.", 400);

  let owner: string;

  try {
    owner = AccountAddress.fromString(raw).toString();
  } catch {
    return fail("Invalid owner address.", 400);
  }

  return json({ success: true, owner, profile: await getProfile(owner) });
}

/** Owner-only: save the profile. Needs a valid wallet signature over the exact content. */
export async function PUT(request: Request) {
  if (rateLimited(`profile:${clientIp(request)}`, 20, 60_000)) {
    return fail("Too many attempts. Wait a minute and try again.", 429);
  }

  let body: Partial<SaveProfileRequest>;

  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  if (
    typeof body.owner !== "string" ||
    typeof body.issuedAt !== "string" ||
    typeof body.publicKey !== "string" ||
    typeof body.signature !== "string" ||
    typeof body.fullMessage !== "string"
  ) {
    return fail("Missing or invalid fields.", 400);
  }

  let owner: string;

  try {
    owner = AccountAddress.fromString(body.owner).toString();
  } catch {
    return fail("Invalid owner address.", 400);
  }

  const cleaned = sanitizeProfile(body);

  if (!cleaned.ok) return fail(cleaned.error, 400);

  const profile = cleaned.profile;

  try {
    // 1. The wallet that owns the address signed exactly this content.
    const hash = await sha256Hex(canonicalProfile(owner, profile));

    await verifyWalletMessage(
      body as SaveProfileRequest,
      buildProfileMessage(hash, body.issuedAt)
    );

    // 2. The profile picture must be an image that really exists under this owner.
    if (profile.avatarBlob) {
      const avatar = await existingCover(owner, profile.avatarBlob);

      if (!avatar) return fail("The profile picture must be an image in your Library.", 400);

      profile.avatarBlob = avatar;
    }

    await saveProfile(owner, profile);

    return json({ success: true, profile });
  } catch (error) {
    if (error instanceof SignatureError) return fail(error.message, 401);

    if (error instanceof DatabaseNotConfiguredError) return fail(error.message, 503);

    console.error("[profile] Save failed:", error);

    return fail("Could not save your profile right now.", 500);
  }
}
