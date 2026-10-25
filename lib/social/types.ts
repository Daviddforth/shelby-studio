/** Tips, follows and views (safe for server and client code). */

/** 1 APT = 100,000,000 octas. */
export const OCTAS_PER_APT = 100_000_000;

/** Smallest tip we record (0.01 APT). Stops dust spam on supporter lists. */
export const TIP_MIN_OCTAS = 1_000_000;

export const TIP_PRESETS_APT = [0.1, 0.5, 1] as const;

export const TIP_FUNCTION = "0x1::aptos_account::transfer";

export function aptToOctas(apt: number): number {
  return Math.round(apt * OCTAS_PER_APT);
}

export function formatApt(octas: number | string): string {
  const value = Number(octas) / OCTAS_PER_APT;

  if (!Number.isFinite(value)) return "0";

  return value >= 100 ? value.toFixed(0) : value >= 1 ? value.toFixed(2).replace(/\.?0+$/, "") : value.toFixed(3).replace(/\.?0+$/, "");
}

export interface TipRecord {
  hash: string;
  from: string;
  to: string;
  /** Octas, as text so very large values stay exact. */
  amount: string;
  createdAt: string;
}

export interface TipSummary {
  count: number;
  /** Total in octas, as text. */
  total: string;
  recent: TipRecord[];
}

export type FollowAction = "follow" | "unfollow";

/** One line a wallet signs to follow or unfollow a creator. */
export function buildFollowMessage(creator: string, action: FollowAction, issuedAt: string): string {
  return `Shelby Studio: ${action} ${creator.toLowerCase()} | ${issuedAt}`;
}

export interface AudienceStats {
  views: number;
  followers: number;
  tipCount: number;
  tipTotal: string;
}
