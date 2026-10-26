import { fail, handleError, json, readSigned } from "@/lib/apiServer";
import { normalizeOwner } from "@/lib/live/server";
import { createLinkCode, isLinked, telegramConfig, unlinkWallet } from "@/lib/telegram/server";

export const runtime = "nodejs";

/** Public: is Telegram set up here, and is this wallet linked. */
export async function GET(request: Request) {
  const wallet = normalizeOwner(new URL(request.url).searchParams.get("wallet"));

  return json({
    success: true,
    enabled: Boolean(telegramConfig()),
    linked: wallet ? await isLinked(wallet) : false,
  });
}

/** Wallet-signed: get a one-time link that connects your wallet to the Telegram bot. */
export async function POST(request: Request) {
  const config = telegramConfig();

  if (!config) return fail("Telegram alerts are not set up on this server yet.", 503);

  const signed = await readSigned(request, "tg-link", 6, "telegram-link", () => ["link"]);

  if (signed instanceof Response) return signed;

  try {
    const code = await createLinkCode(signed.owner);

    return json({ success: true, url: `https://t.me/${config.username}?start=${code}` });
  } catch (error) {
    return handleError("telegram", error);
  }
}

/** Wallet-signed: stop Telegram alerts. */
export async function DELETE(request: Request) {
  const signed = await readSigned(request, "tg-unlink", 6, "telegram-unlink", () => ["unlink"]);

  if (signed instanceof Response) return signed;

  try {
    await unlinkWallet(signed.owner);

    return json({ success: true });
  } catch (error) {
    return handleError("telegram", error);
  }
}
