import { SignatureError, verifyWalletMessage, type WalletProof } from "@/lib/media/auth";
import { clientIp, normalizeOwner, rateLimited } from "@/lib/live/server";
import { DatabaseNotConfiguredError } from "@/lib/media/db";
import { pushPublicKey } from "@/lib/push/server";
import { social } from "@/lib/social/db";
import { buildNotifyMessage } from "@/lib/social/types";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Public: whether notifications are switched on for this server, and (with wallet+endpoint) for this browser. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const publicKey = pushPublicKey();

  const wallet = normalizeOwner(params.get("wallet"));

  const endpoint = params.get("endpoint");

  const subscribed = wallet && endpoint ? await social.hasPush(wallet, endpoint).catch(() => false) : false;

  return json({ success: true, enabled: Boolean(publicKey), publicKey, subscribed });
}

/** Wallet-signed: turn live notifications on or off for one browser. */
export async function POST(request: Request) {
  if (rateLimited(`push:${clientIp(request)}`, 20, 60_000)) {
    return json({ success: false, error: "Too many requests. Try again in a minute." }, 429);
  }

  let body: Partial<WalletProof> & { action?: unknown; subscription?: { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } } };

  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request." }, 400);
  }

  const wallet = normalizeOwner(body.owner);

  const action = body.action === "on" || body.action === "off" ? body.action : null;

  const sub = body.subscription;

  if (
    !wallet ||
    !action ||
    typeof body.issuedAt !== "string" ||
    typeof body.publicKey !== "string" ||
    typeof body.signature !== "string" ||
    typeof body.fullMessage !== "string" ||
    typeof sub?.endpoint !== "string" ||
    !sub.endpoint.startsWith("https://") ||
    sub.endpoint.length > 1000 ||
    typeof sub.keys?.p256dh !== "string" ||
    typeof sub.keys?.auth !== "string"
  ) {
    return json({ success: false, error: "Missing or invalid fields." }, 400);
  }

  try {
    await verifyWalletMessage(body as WalletProof, buildNotifyMessage(wallet, action, body.issuedAt), Date.now(), 2 * 60_000);

    if (action === "on") {
      if (!pushPublicKey()) return json({ success: false, error: "Notifications are not set up on this server yet." }, 503);

      await social.addPush(wallet, { endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth });
    } else {
      await social.removePush(wallet, sub.endpoint);
    }

    return json({ success: true, subscribed: action === "on" });
  } catch (error) {
    if (error instanceof SignatureError) return json({ success: false, error: error.message }, 401);

    if (error instanceof DatabaseNotConfiguredError) return json({ success: false, error: error.message }, 503);

    console.error("[push] failed", error);

    return json({ success: false, error: "Could not update notifications." }, 500);
  }
}
