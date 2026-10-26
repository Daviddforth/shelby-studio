import { timingSafeEqual } from "crypto";

import { redeemCode, telegramConfig, telegramSend, unlinkChat } from "@/lib/telegram/server";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);

  const right = Buffer.from(b);

  return left.length === right.length && timingSafeEqual(left, right);
}

/** Telegram calls this when someone writes to the bot. Only requests carrying our secret are accepted. */
export async function POST(request: Request) {
  const config = telegramConfig();

  if (!config) return new Response("Not set up", { status: 503 });

  if (!safeEqual(request.headers.get("x-telegram-bot-api-secret-token") ?? "", config.secret)) {
    return new Response("Forbidden", { status: 403 });
  }

  let update: { message?: { text?: string; chat?: { id?: number | string; type?: string } } };

  try {
    update = await request.json();
  } catch {
    return new Response("ok");
  }

  const text = update.message?.text?.trim() ?? "";

  const chatId = update.message?.chat?.id;

  // Alerts only go to private chats, never to groups or channels.
  if (chatId === undefined || update.message?.chat?.type !== "private") return new Response("ok");

  const chat = String(chatId);

  try {
    const start = /^\/start(?:@\w+)?\s+([0-9a-f]{24})$/.exec(text);

    if (start) {
      const wallet = await redeemCode(start[1], chat);

      await telegramSend(
        chat,
        wallet
          ? "Connected. You will get a message here when a creator you follow on Shelby Studio goes live. Send /stop any time to turn it off."
          : "That link has expired. Go back to Shelby Studio and press the Telegram button again."
      );
    } else if (/^\/stop(?:@\w+)?$/.test(text)) {
      await unlinkChat(chat);

      await telegramSend(chat, "Done. You will not get alerts here any more.");
    } else if (/^\/start/.test(text)) {
      await telegramSend(chat, "To get live alerts, open Shelby Studio, follow a creator, and press the Telegram button on Discover.");
    }
  } catch (error) {
    console.error("[telegram] webhook failed", error);
  }

  return new Response("ok");
}
