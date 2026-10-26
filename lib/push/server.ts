import "server-only";

import webpush from "web-push";

import { social } from "@/lib/social/db";

/**
 * Browser notifications ("Web Push"). They need a VAPID key pair in the server
 * environment. Without it the feature is simply switched off.
 */
export function pushPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY?.trim() || null;
}

function configure(): boolean {
  const publicKey = pushPublicKey();

  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();

  if (!publicKey || !privateKey) return false;

  webpush.setVapidDetails(process.env.VAPID_SUBJECT?.trim() || "mailto:hello@shelbystudio.xyz", publicKey, privateKey);

  return true;
}

const lastSent = new Map<string, number>();

/** Same creator at most once every 10 minutes, so restarting a stream does not spam followers. */
export function shouldNotify(creator: string, now = Date.now(), minGapMs = 10 * 60_000): boolean {
  const last = lastSent.get(creator) ?? 0;

  if (now - last < minGapMs) return false;

  lastSent.set(creator, now);

  return true;
}

export interface Alert {
  title: string;
  body: string;
  /** A path on this site, opened when the notification is tapped. */
  url: string;
}

/** Sends one alert to every browser that follows `creator` and turned alerts on. Returns how many were sent. */
export async function pushToFollowers(creator: string, alert: Alert): Promise<number> {
  if (!configure()) return 0;

  const targets = await social.pushTargets(creator).catch(() => []);

  const payload = JSON.stringify(alert);

  let sent = 0;

  await Promise.all(
    targets.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
          { TTL: 300, urgency: "high" }
        );

        sent += 1;
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode;

        // The browser says this subscription is gone for good.
        if (status === 404 || status === 410) await social.dropPush(sub.endpoint).catch(() => {});
      }
    })
  );

  return sent;
}
