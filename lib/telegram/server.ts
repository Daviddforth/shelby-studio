import "server-only";

import { getSiteOrigin } from "@/lib/media/types";
import type { Alert } from "@/lib/push/server";
import { docs, safeDocs } from "@/lib/store/docs";
import { social } from "@/lib/social/db";

/**
 * Telegram alerts. A fan links their wallet to a Telegram chat by opening a one-time
 * link to the bot. After that the bot messages them when a creator they follow goes live.
 * Needs TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME and TELEGRAM_WEBHOOK_SECRET.
 */

export function telegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

  const username = process.env.TELEGRAM_BOT_USERNAME?.trim().replace(/^@/, "");

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

  return token && username && secret ? { token, username, secret } : null;
}

export const CODE_TTL_MS = 15 * 60_000;

export async function telegramSend(chatId: string, text: string): Promise<boolean> {
  const config = telegramConfig();

  if (!config) return false;

  try {
    const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: false }),
      signal: AbortSignal.timeout(8000),
    });

    if (response.status === 403) {
      // The person blocked the bot: forget the chat.
      await unlinkChat(chatId).catch(() => {});
    }

    return response.ok;
  } catch {
    return false;
  }
}

export async function createLinkCode(wallet: string): Promise<string> {
  const code = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");

  await docs.put("tg_code", code, "code", { wallet, expiresAt: Date.now() + CODE_TTL_MS });

  return code;
}

/** Turns a one-time code into a link between a wallet and a chat. Returns the wallet, or null if the code is wrong or old. */
export async function redeemCode(code: string, chatId: string): Promise<string | null> {
  if (!/^[0-9a-f]{24}$/.test(code)) return null;

  const doc = await docs.get<{ wallet: string; expiresAt: number }>("tg_code", code, "code");

  if (!doc) return null;

  await docs.del("tg_code", code, "code");

  if (doc.data.expiresAt < Date.now()) return null;

  await docs.put("tg_chat", doc.data.wallet, chatId, {});
  await docs.put("tg_by_chat", chatId, doc.data.wallet, {});

  return doc.data.wallet;
}

export async function isLinked(wallet: string): Promise<boolean> {
  return (await safeDocs.list("tg_chat", wallet, 1)).length > 0;
}

export async function unlinkWallet(wallet: string): Promise<void> {
  for (const chat of await docs.list("tg_chat", wallet, 20)) {
    await docs.del("tg_chat", wallet, chat.id);
    await docs.del("tg_by_chat", chat.id, wallet);
  }
}

export async function unlinkChat(chatId: string): Promise<void> {
  for (const link of await docs.list("tg_by_chat", chatId, 50)) {
    await docs.del("tg_chat", link.id, chatId);
    await docs.del("tg_by_chat", chatId, link.id);
  }
}

/** Messages every linked chat of everyone who follows `creator`. Returns how many were sent. */
export async function telegramToFollowers(creator: string, alert: Alert): Promise<number> {
  if (!telegramConfig()) return 0;

  const followers = await social.followersOf(creator, 500).catch(() => [] as string[]);

  const chats = new Set<string>();

  for (const wallet of followers) {
    for (const chat of await safeDocs.list("tg_chat", wallet, 5)) chats.add(chat.id);
  }

  const text = `${alert.title}\n${alert.body}\n${getSiteOrigin()}${alert.url}`;

  let sent = 0;

  for (const chatId of chats) {
    if (await telegramSend(chatId, text)) sent += 1;
  }

  return sent;
}
