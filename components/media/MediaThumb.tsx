import { Music } from "lucide-react";

import { mediaStreamPath, type MediaKind } from "@/lib/media/types";

interface Props {
  owner: string;
  blobName: string;
  kind: MediaKind;
  title: string;
  /** Blob name of the creator's chosen cover image, if any. */
  coverBlob?: string | null;
}

/**
 * Square-ish preview tile for a hosted file: the creator's cover when set,
 * otherwise the image itself, the first frame of a video, or an icon for
 * audio. Safe to use from server and client components.
 */
export default function MediaThumb({
  owner,
  blobName,
  kind,
  title,
  coverBlob,
}: Props) {
  const src = mediaStreamPath(owner, blobName);

  if (kind !== "image" && coverBlob) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mediaStreamPath(owner, coverBlob)}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }

  if (kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }

  if (kind === "video") {
    return (
      <video
        src={`${src}#t=0.1`}
        preload="metadata"
        muted
        playsInline
        aria-label={title}
        className="h-full w-full bg-black object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
      <Music size={36} className="text-blue-300" aria-label={title} />
    </div>
  );
}
