import { SignatureError, verifyWalletMessage, type WalletProof } from "@/lib/media/auth";
import { clientIp, normalizeOwner, rateLimited } from "@/lib/live/server";
import { DatabaseNotConfiguredError } from "@/lib/media/db";
import { getFollowerCount, social } from "@/lib/social/db";
import { buildFollowMessage, type FollowAction } from "@/lib/social/types";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Public: follower count, whether `follower` follows `creator`, or the list a wallet follows. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const creator = normalizeOwner(params.get("creator"));

  const follower = normalizeOwner(params.get("follower"));

  try {
    if (params.get("list") === "1") {
      if (!follower) return json({ success: false, error: "Invalid wallet." }, 400);

      return json({ success: true, following: await social.following(follower) });
    }

    if (!creator) return json({ success: false, error: "Invalid creator." }, 400);

    return json({
      success: true,
      count: await getFollowerCount(creator),
      following: follower ? await social.isFollowing(follower, creator).catch(() => false) : false,
    });
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return json({ success: true, following: [] });

    return json({ success: false, error: "Could not load follows." }, 500);
  }
}

/** Wallet-signed: only you can make your wallet follow or unfollow someone. */
export async function POST(request: Request) {
  if (rateLimited(`follow:${clientIp(request)}`, 30, 60_000)) {
    return json({ success: false, error: "Too many requests. Try again in a minute." }, 429);
  }

  let body: Partial<WalletProof> & { creator?: unknown; action?: unknown };

  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request." }, 400);
  }

  const follower = normalizeOwner(body.owner);

  const creator = normalizeOwner(body.creator);

  const action: FollowAction | null = body.action === "follow" || body.action === "unfollow" ? body.action : null;

  if (
    !follower ||
    !creator ||
    !action ||
    typeof body.issuedAt !== "string" ||
    typeof body.publicKey !== "string" ||
    typeof body.signature !== "string" ||
    typeof body.fullMessage !== "string"
  ) {
    return json({ success: false, error: "Missing or invalid fields." }, 400);
  }

  if (follower === creator) return json({ success: false, error: "You cannot follow yourself." }, 400);

  try {
    await verifyWalletMessage(body as WalletProof, buildFollowMessage(creator, action, body.issuedAt), Date.now(), 2 * 60_000);

    await social.setFollow(follower, creator, action === "follow");

    return json({ success: true, count: await getFollowerCount(creator), following: action === "follow" });
  } catch (error) {
    if (error instanceof SignatureError) return json({ success: false, error: error.message }, 401);

    if (error instanceof DatabaseNotConfiguredError) return json({ success: false, error: error.message }, 503);

    console.error("[follow] failed", error);

    return json({ success: false, error: "Could not update follow." }, 500);
  }
}
