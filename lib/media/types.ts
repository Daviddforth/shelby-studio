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
