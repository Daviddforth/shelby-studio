/**
 * Live chat protocol and moderation rules (safe for server and client).
 *
 * Viewers send messages only to the host (topic "chat"). The host checks the
 * message against its blocked words and mute list, then relays the ones it
 * accepts to everybody (topic "chat-relay"). Viewers only show relayed
 * messages from the host, so anything a viewer sends around the host is
 * simply ignored by honest clients.
 */

export const CHAT_TOPIC = "chat";

export const RELAY_TOPIC = "chat-relay";

export const NOTICE_TOPIC = "chat-notice";

export const BLOCKED_WORDS_MAX = 50;

export interface ChatLine {
  id: number;
  name: string;
  text: string;
  host: boolean;
  /** Viewer identity, so the host can mute or remove the sender. Empty for the host's own lines. */
  identity: string;
}

/** Turns "word, another word" into a clean, lowercase list. */
export function parseBlockedWords(text: string): string[] {
  const words = text
    .split(/[,\n]/)
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length >= 2 && word.length <= 40);

  return Array.from(new Set(words)).slice(0, BLOCKED_WORDS_MAX);
}

function squash(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** True when the message contains a blocked word or phrase. Ignores case, accents and punctuation. */
export function containsBlockedWord(text: string, blocked: string[]): boolean {
  if (blocked.length === 0) return false;

  const padded = ` ${squash(text)} `;

  const joined = padded.replace(/ /g, "");

  return blocked.some((word) => {
    const clean = squash(word);

    if (!clean) return false;

    // Whole word or phrase, or the same letters run together (b a d => bad).
    return padded.includes(` ${clean} `) || joined.includes(clean.replace(/ /g, ""));
  });
}
