import "server-only";

import { getProfile } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";
import { telegramToFollowers } from "@/lib/telegram/server";
import { pushToFollowers, shouldNotify, type Alert } from "@/lib/push/server";

/**
 * Tells a creator's followers something, on every channel they turned on.
 * `key` keeps one kind of message from repeating too often.
 */
export async function notifyFollowers(
  creator: string,
  kind: "live" | "schedule",
  build: (name: string) => Alert,
  minGapMs: number
): Promise<void> {
  if (!shouldNotify(`${kind}:${creator}`, Date.now(), minGapMs)) return;

  const name = profileLabel(await getProfile(creator).catch(() => null), creator);

  const alert = build(name);

  await Promise.allSettled([pushToFollowers(creator, alert), telegramToFollowers(creator, alert)]);
}
