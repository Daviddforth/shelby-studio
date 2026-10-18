import type { MediaKind } from "@/lib/media/types";

interface Props {
  kind: MediaKind;
  src: string;
  title: string;
  /** Cover picture URL: video poster, or the artwork shown above audio. */
  poster?: string;
  /** Fill the available height (used by the embed page). */
  fill?: boolean;
}

/**
 * Renders the native browser player for a hosted file. The browser handles
 * seeking through the Range-enabled streaming route, so no client JavaScript
 * is needed here.
 */
export default function MediaPlayer({
  kind,
  src,
  title,
  poster,
  fill = false,
}: Props) {
  if (kind === "video") {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        src={src}
        poster={poster}
        title={title}
        className={
          fill
            ? "h-full w-full bg-black object-contain"
            : "aspect-video w-full rounded-2xl bg-black object-contain"
        }
      />
    );
  }

  if (kind === "audio") {
    return (
      <div className="w-full">
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={title}
            className="mb-4 aspect-square w-full max-w-xs rounded-2xl object-cover"
          />
        )}

        <audio
          controls
          preload="metadata"
          src={src}
          title={title}
          className="w-full"
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      className={
        fill
          ? "h-full w-full object-contain"
          : "max-h-[75vh] w-full rounded-2xl object-contain"
      }
    />
  );
}
