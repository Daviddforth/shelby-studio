import type { MediaKind } from "@/lib/media/types";

interface Props {
  kind: MediaKind;
  src: string;
  title: string;
  /** Fill the available height (used by the embed page). */
  fill?: boolean;
}

/**
 * Renders the native browser player for a hosted file. The browser handles
 * seeking through the Range-enabled streaming route, so no client JavaScript
 * is needed here.
 */
export default function MediaPlayer({ kind, src, title, fill = false }: Props) {
  if (kind === "video") {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        src={src}
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
      <audio
        controls
        preload="metadata"
        src={src}
        title={title}
        className="w-full"
      />
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
