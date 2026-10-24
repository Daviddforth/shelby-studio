import { verifyWalletMessage, SignatureError, type WalletProof } from "@/lib/media/auth";
import { DatabaseNotConfiguredError } from "@/lib/media/db";
import { clientIp, normalizeOwner, rateLimited } from "@/lib/live/server";
import { listReports, markReportReviewed } from "@/lib/reports/db";
import { buildAdminMessage } from "@/lib/reports/types";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/**
 * Only the wallet named in ADMIN_WALLET_ADDRESS can read or update reports,
 * and only by signing a fresh message (no passwords, nothing stored).
 */
async function authorize(request: Request, body: Partial<WalletProof>) {
  const admin = normalizeOwner(process.env.ADMIN_WALLET_ADDRESS);

  if (!admin) return json({ success: false, error: "ADMIN_WALLET_ADDRESS is not set on this server." }, 503);

  if (rateLimited(`admin:${clientIp(request)}`, 20, 60_000)) {
    return json({ success: false, error: "Too many attempts." }, 429);
  }

  if (
    typeof body.owner !== "string" ||
    typeof body.issuedAt !== "string" ||
    typeof body.publicKey !== "string" ||
    typeof body.signature !== "string" ||
    typeof body.fullMessage !== "string" ||
    normalizeOwner(body.owner) !== admin
  ) {
    return json({ success: false, error: "Not allowed." }, 403);
  }

  try {
    await verifyWalletMessage(body as WalletProof, buildAdminMessage(body.issuedAt), Date.now(), 2 * 60_000);
  } catch (error) {
    if (error instanceof SignatureError) return json({ success: false, error: error.message }, 401);

    return json({ success: false, error: "Could not verify your wallet." }, 401);
  }

  return null;
}

export async function POST(request: Request) {
  let body: Partial<WalletProof> & { markReviewed?: unknown };

  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request." }, 400);
  }

  const denied = await authorize(request, body);

  if (denied) return denied;

  try {
    if (typeof body.markReviewed === "string") await markReportReviewed(body.markReviewed);

    return json({ success: true, reports: await listReports() });
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return json({ success: false, error: error.message }, 503);

    console.error("[admin reports] failed", error);

    return json({ success: false, error: "Could not load reports." }, 500);
  }
}
