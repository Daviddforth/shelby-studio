/**
 * Shared media helpers (safe to import from both server and client code).
 *
 * Only the file types listed here are ever served by the public media
 * route. Anything else (HTML, SVG, JSON, executables...) is refused so the
 * app origin cannot be used to host scriptable content.
 */

export type MediaKind = "video" | "audio" | "image";

export interface MediaType {
  kind: MediaKind;
  mime: string;
}

const MEDIA_TYPES: Record<string, MediaType> = {
  // Video
  mp4: { kind: "video", mime: "video/mp4" },
  m4v: { kind: "video", mime: "video/mp4" },
  webm: { kind: "video", mime: "video/webm" },
  mov: { kind: "video", mime: "video/quicktime" },
  ogv: { kind: "video", mime: "video/ogg" },

  // Audio
  mp3: { kind: "audio", mime: "audio/mpeg" },
  wav: { kind: "audio", mime: "audio/wav" },
  m4a: { kind: "audio", mime: "audio/mp4" },
  aac: { kind: "audio", mime: "audio/aac" },
  ogg: { kind: "audio", mime: "audio/ogg" },
  oga: { kind: "audio", mime: "audio/ogg" },
  opus: { kind: "audio", mime: "audio/ogg" },
  flac: { kind: "audio", mime: "audio/flac" },

  // Images (SVG is deliberately excluded: it can carry scripts)
  jpg: { kind: "image", mime: "image/jpeg" },
  jpeg: { kind: "image", mime: "image/jpeg" },
  png: { kind: "image", mime: "image/png" },
  gif: { kind: "image", mime: "image/gif" },
  webp: { kind: "image", mime: "image/webp" },
  avif: { kind: "image", mime: "image/avif" },
};

/** Returns the media type for a file name, or null if it is not hostable media. */
export function getMediaType(fileName: string): MediaType | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension || extension === fileName.toLowerCase()) {
    return null;
  }

  return MEDIA_TYPES[extension] ?? null;
}

/** Last path segment of a blob name. */
export function getFileName(blobName: string): string {
  return blobName.split("/").pop() || blobName;
}

/** URL-safe path for an owner + blob name, e.g. `0xabc/folder/clip.mp4`. */
export function mediaPath(owner: string, blobName: string): string {
  return [owner, ...blobName.split("/")]
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/** Path of the raw streaming endpoint for a blob. */
export function mediaStreamPath(owner: string, blobName: string): string {
  return `/api/media/${mediaPath(owner, blobName)}`;
}

/** Path of the public viewer page for a blob. */
export function mediaPagePath(owner: string, blobName: string): string {
  return `/m/${mediaPath(owner, blobName)}`;
}

/** Path of the embeddable player page for a blob. */
export function mediaEmbedPath(owner: string, blobName: string): string {
  return `/embed/${mediaPath(owner, blobName)}`;
}

/** Builds the `<iframe>` snippet creators paste into their own sites. */
export function buildEmbedCode(
  origin: string,
  owner: string,
  blobName: string,
  kind: MediaKind
): string {
  const src = `${origin}${mediaEmbedPath(owner, blobName)}`;

  const height = kind === "audio" ? 96 : 360;

  return `<iframe src="${src}" width="640" height="${height}" frameborder="0" allow="fullscreen" allowfullscreen loading="lazy"></iframe>`;
}

/** Site origin used for absolute URLs in server-rendered metadata. */
export function getSiteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.shelbystudio.xyz"
  );
}

/* ------------------------------------------------------------------ */
/* Media details (title, description, cover) and wallet-signed saves   */
/* ------------------------------------------------------------------ */

export const TITLE_MAX = 120;

export const DESCRIPTION_MAX = 2000;

/** Editable details a creator can attach to a hosted file. */
export interface MediaDetails {
  title: string;
  description: string;
  /** Blob name of an image (owned by the same creator) used as the cover. */
  coverBlob: string | null;
}

/** Lookup of details by blob name. */
export type MediaDetailsMap = Record<string, MediaDetails>;

/** How long a signed save request stays valid. */
export const SIGNATURE_MAX_AGE_MS = 5 * 60 * 1000;

/** The text a wallet signs to authorize saving details. Single line on purpose. */
export function buildSaveMessage(
  blobName: string,
  payloadHash: string,
  issuedAt: string
): string {
  return `Shelby Studio: save details for ${blobName} | ref ${payloadHash.slice(
    0,
    32
  )} | ${issuedAt}`;
}

/** Canonical text of what is being saved; its hash is bound into the signed message. */
export function canonicalDetails(
  owner: string,
  blobName: string,
  details: MediaDetails
): string {
  return JSON.stringify({
    owner,
    blobName,
    title: details.title,
    description: details.description,
    coverBlob: details.coverBlob,
  });
}

/** SHA-256 as hex. Works in browsers and Node 20+ (same Web Crypto API). */
export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Body sent to PUT /api/media-details. */
export interface SaveDetailsRequest {
  owner: string;
  blobName: string;
  title: string;
  description: string;
  coverBlob: string | null;
  issuedAt: string;
  publicKey: string;
  /** Base64 signature bytes. */
  signature: string;
  fullMessage: string;
}

/** Title shown to viewers: the creator's title, or the file name when none is set. */
export function displayTitle(
  blobName: string,
  details?: Pick<MediaDetails, "title"> | null
): string {
  return details?.title?.trim() || getFileName(blobName);
}

/** Collapses text for use in link previews. */
export function summarize(text: string, max = 200): string {
  const flat = text.replace(/\s+/g, " ").trim();

  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}
