import "server-only";

import { AccountAddress } from "@aptos-labs/ts-sdk";

import {
  AccessToken,
  RoomServiceClient,
  TokenVerifier,
  TrackSource,
} from "livekit-server-sdk";

import {
  OFFLINE,
  hostIdentity,
  isHostIdentity,
  isViewerIdentity,
  liveRoomName,
  type LiveStatus,
} from "./types";

export class LiveConfigError extends Error {
  status = 503;
}

export const HOST_TOKEN_TTL_SECONDS = 6 * 60 * 60;

export const VIEWER_TOKEN_TTL_SECONDS = 4 * 60 * 60;

/** Safety cap on one room so a viral stream cannot burn the whole free plan. */
export function maxParticipants(): number {
  const value = Number(process.env.LIVE_MAX_PARTICIPANTS);

  return Number.isInteger(value) && value >= 2 && value <= 5000 ? value : 100;
}

interface LiveConfig {
  url: string;
  httpUrl: string;
  key: string;
  secret: string;
}

export function getLiveConfig(): LiveConfig {
  const url = process.env.LIVEKIT_URL?.trim();
  const key = process.env.LIVEKIT_API_KEY?.trim();
  const secret = process.env.LIVEKIT_API_SECRET?.trim();

  if (!url || !key || !secret) {
    throw new LiveConfigError("Live streaming is not set up on this server yet.");
  }

  // Clients connect with wss://, the server API uses https://.
  const httpUrl = url.replace(/^wss:/, "https:").replace(/^ws:/, "http:");

  return { url, httpUrl, key, secret };
}

function rooms(config = getLiveConfig()) {
  return new RoomServiceClient(config.httpUrl, config.key, config.secret);
}

/** Returns the canonical 0x… address, or null when the text is not an address. */
export function normalizeOwner(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    return AccountAddress.fromString(value.trim()).toString();
  } catch {
    return null;
  }
}

export async function createHostToken(owner: string): Promise<string> {
  const config = getLiveConfig();

  const token = new AccessToken(config.key, config.secret, {
    identity: hostIdentity(owner),
    name: "Host",
    ttl: HOST_TOKEN_TTL_SECONDS,
  });

  token.addGrant({
    room: liveRoomName(owner),
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    canPublishSources: [
      TrackSource.CAMERA,
      TrackSource.MICROPHONE,
      TrackSource.SCREEN_SHARE,
      TrackSource.SCREEN_SHARE_AUDIO,
    ],
  });

  return token.toJwt();
}

/** Viewers can watch, listen and chat, but never publish video or audio. */
export async function createViewerToken(
  owner: string,
  name: string
): Promise<string> {
  const config = getLiveConfig();

  const id = crypto.randomUUID();

  const token = new AccessToken(config.key, config.secret, {
    identity: `viewer-${id}`,
    name,
    ttl: VIEWER_TOKEN_TTL_SECONDS,
  });

  token.addGrant({
    room: liveRoomName(owner),
    roomJoin: true,
    canPublish: false,
    canSubscribe: true,
    canPublishData: true,
    canPublishSources: [],
  });

  return token.toJwt();
}

/** Reads a host token and returns the owner it belongs to, or null. */
export async function ownerFromHostToken(token: string): Promise<string | null> {
  const config = getLiveConfig();

  try {
    const claims = await new TokenVerifier(config.key, config.secret).verify(token);

    const room = claims.video?.room;

    if (!claims.sub || !isHostIdentity(claims.sub) || !room?.startsWith("live-")) {
      return null;
    }

    const owner = normalizeOwner(claims.sub.slice("host-".length));

    if (!owner || liveRoomName(owner) !== room) return null;

    return owner;
  } catch {
    return null;
  }
}

export async function startRoom(owner: string, title: string): Promise<void> {
  const client = rooms();

  await client.createRoom({
    name: liveRoomName(owner),
    emptyTimeout: 60,
    departureTimeout: 30,
    maxParticipants: maxParticipants(),
    metadata: JSON.stringify({ title }),
  });
}

export async function endRoom(owner: string): Promise<void> {
  try {
    await rooms().deleteRoom(liveRoomName(owner));
  } catch {
    // Room already gone: the stream is over either way.
  }
}

/** A creator is "live" only while their own host connection is in the room. */
export async function getLiveStatus(owner: string): Promise<LiveStatus> {
  const client = rooms();

  const name = liveRoomName(owner);

  let participants;

  try {
    participants = await client.listParticipants(name);
  } catch {
    return OFFLINE;
  }

  if (!participants.some((p) => isHostIdentity(p.identity))) return OFFLINE;

  let title = "";

  try {
    const [room] = await client.listRooms([name]);

    title = String(JSON.parse(room?.metadata || "{}").title ?? "");
  } catch {
    title = "";
  }

  return {
    live: true,
    title,
    viewers: participants.filter((p) => isViewerIdentity(p.identity)).length,
  };
}

/** Tiny per-process limiter. Enough to blunt token-farming; not a replacement for LiveKit's caps. */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return false;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");

  return forwarded?.split(",")[0]?.trim() || "unknown";
}
