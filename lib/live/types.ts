/**
 * Shared rules for live streaming (safe to import from server and client code).
 *
 * Every stream gets its own random code, so the watch link (/live/<code>)
 * never shows the creator's wallet address. Only the wallet that started the
 * stream can broadcast on it; everyone else can watch and chat.
 */

export const LIVE_TITLE_MAX = 100;

export const VIEWER_NAME_MAX = 30;

export const CHAT_MESSAGE_MAX = 300;

/** Viewers and hosts are told apart by their identity prefix. */
export const HOST_PREFIX = "host-";

export const VIEWER_PREFIX = "viewer-";

/** Random, unguessable stream code (80 bits, lowercase hex). */
export const STREAM_CODE_RE = /^[a-f0-9]{20}$/;

export function isStreamCode(value: unknown): value is string {
  return typeof value === "string" && STREAM_CODE_RE.test(value);
}

export function liveRoomName(code: string): string {
  return `live-${code}`;
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

/** Public page where people watch a stream. */
export function liveWatchPath(code: string): string {
  return `/live/${code}`;
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
  /** Random code of the current stream, used to build the watch link. */
  code: string;
  /** Wallet that is streaming (already public on their creator page). */
  owner: string;
}

export const OFFLINE: LiveStatus = { live: false, title: "", viewers: 0, code: "", owner: "" };

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
