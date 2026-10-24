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
  isStreamCode,
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

export function newStreamCode(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

export async function createHostToken(owner: string, code: string): Promise<string> {
  const config = getLiveConfig();

  const token = new AccessToken(config.key, config.secret, {
    identity: hostIdentity(owner),
    name: "Host",
    ttl: HOST_TOKEN_TTL_SECONDS,
  });

  token.addGrant({
    room: liveRoomName(code),
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
  code: string,
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
    room: liveRoomName(code),
    roomJoin: true,
    canPublish: false,
    canSubscribe: true,
    canPublishData: true,
    canPublishSources: [],
  });

  return token.toJwt();
}

/** Reads a host token and returns the owner and stream code it belongs to, or null. */
export async function ownerFromHostToken(
  token: string
): Promise<{ owner: string; code: string } | null> {
  const config = getLiveConfig();

  try {
    const claims = await new TokenVerifier(config.key, config.secret).verify(token);

    const room = claims.video?.room;

    if (!claims.sub || !isHostIdentity(claims.sub) || !room?.startsWith("live-")) {
      return null;
    }

    const owner = normalizeOwner(claims.sub.slice("host-".length));

    const code = room.slice("live-".length);

    if (!owner || !isStreamCode(code)) return null;

    return { owner, code };
  } catch {
    return null;
  }
}

export const hostFromToken = ownerFromHostToken;

interface FoundRoom {
  code: string;
  owner: string;
  title: string;
}

function readRoom(room: { name: string; metadata?: string }): FoundRoom | null {
  if (!room.name.startsWith("live-")) return null;

  const code = room.name.slice("live-".length);

  if (!isStreamCode(code)) return null;

  try {
    const meta = JSON.parse(room.metadata || "{}");

    return { code, owner: String(meta.owner ?? ""), title: String(meta.title ?? "") };
  } catch {
    return { code, owner: "", title: "" };
  }
}

/** The open room for a creator, if any (the owner is stored in the room's metadata). */
async function findOwnerRoom(owner: string): Promise<FoundRoom | null> {
  const all = await rooms().listRooms();

  for (const room of all) {
    const found = readRoom(room);

    if (found && found.owner === owner) return found;
  }

  return null;
}

/** Opens a room for this creator and returns its random code. A creator who is already streaming keeps the same link. */
export async function startRoom(owner: string, title: string): Promise<string> {
  const client = rooms();

  const metadata = JSON.stringify({ title, owner });

  const existing = await findOwnerRoom(owner);

  if (existing) {
    await client.updateRoomMetadata(liveRoomName(existing.code), metadata);

    return existing.code;
  }

  const code = newStreamCode();

  await client.createRoom({
    name: liveRoomName(code),
    emptyTimeout: 60,
    departureTimeout: 30,
    maxParticipants: maxParticipants(),
    metadata,
  });

  return code;
}

export async function endRoom(code: string): Promise<void> {
  try {
    await rooms().deleteRoom(liveRoomName(code));
  } catch {
    // Room already gone: the stream is over either way.
  }
}

/** The wallet that owns a stream (from the room), or null when the stream is not open. */
export async function getStreamOwner(code: string): Promise<string | null> {
  try {
    const [room] = await rooms().listRooms([liveRoomName(code)]);

    return (room && readRoom(room)?.owner) || null;
  } catch {
    return null;
  }
}

/**
 * Is this stream live? `ref` is a stream code (the public link) or a wallet
 * address (used by a creator's own page). A stream is "live" only while the
 * host's own connection is in the room.
 */
export async function getLiveStatus(ref: string): Promise<LiveStatus> {
  const client = rooms();

  let found: FoundRoom | null = null;

  try {
    if (isStreamCode(ref)) {
      const [room] = await client.listRooms([liveRoomName(ref)]);

      found = room ? readRoom(room) : null;
    } else {
      const owner = normalizeOwner(ref);

      found = owner ? await findOwnerRoom(owner) : null;
    }
  } catch {
    return OFFLINE;
  }

  if (!found) return OFFLINE;

  let participants;

  try {
    participants = await client.listParticipants(liveRoomName(found.code));
  } catch {
    return OFFLINE;
  }

  if (!participants.some((p) => isHostIdentity(p.identity))) return OFFLINE;

  return {
    live: true,
    title: found.title,
    owner: found.owner,
    code: found.code,
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
