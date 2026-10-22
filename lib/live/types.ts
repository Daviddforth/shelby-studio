/**
 * Shared rules for live streaming (safe to import from server and client code).
 *
 * Each creator has one live room, named after their wallet address. The link
 * to watch is /live/<address>. Only the wallet that owns the address can
 * broadcast; everyone else can watch and chat.
 */

export const LIVE_TITLE_MAX = 100;

export const VIEWER_NAME_MAX = 30;

export const CHAT_MESSAGE_MAX = 300;

/** Viewers and hosts are told apart by their identity prefix. */
export const HOST_PREFIX = "host-";

export const VIEWER_PREFIX = "viewer-";

export function liveRoomName(owner: string): string {
  return `live-${owner.toLowerCase()}`;
}

export function hostIdentity(owner: string): string {
  return `${HOST_PREFIX}${owner.toLowerCase()}`;
}

export function isHostIdentity(identity: string | undefined | null): boolean {
  return Boolean(identity?.startsWith(HOST_PREFIX));
}

export function isViewerIdentity(identity: string | undefined | null): boolean {
  return Boolean(identity?.startsWith(VIEWER_PREFIX));
}

/** Public page where people watch a creator's live. */
export function liveWatchPath(owner: string): string {
  return `/live/${owner}`;
}

/** The text a wallet signs to prove the creator is the one going live. Single line on purpose. */
export function buildLiveMessage(
  owner: string,
  title: string,
  issuedAt: string
): string {
  return `Shelby Studio: go live as ${owner} titled "${title}" | ${issuedAt}`;
}

/** Wallet signatures for going live must be fresh. */
export const LIVE_SIGNATURE_MAX_AGE_MS = 2 * 60 * 1000;

export interface LiveStatus {
  live: boolean;
  title: string;
  viewers: number;
}

export const OFFLINE: LiveStatus = { live: false, title: "", viewers: 0 };

/** Body sent to POST /api/live/start. */
export interface StartLiveRequest {
  owner: string;
  title: string;
  issuedAt: string;
  publicKey: string;
  /** Base64 signature bytes. */
  signature: string;
  fullMessage: string;
}

/** Strips control characters, collapses spaces and limits length. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
