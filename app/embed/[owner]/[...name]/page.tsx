import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { connection } from "next/server";

import MediaPlayer from "@/components/media/MediaPlayer";

import {
  MediaLookupError,
  resolveMedia,
  type ResolvedMedia,
} from "@/lib/media/server";

import { getFileName, mediaStreamPath } from "@/lib/media/types";

type PageProps = {
  params: Promise<{
    owner: string;
    name: string[];
  }>;
};

// Embeds are for other people's pages; keep them out of search results.
export const metadata: Metadata = {
  title: "Shelby Studio player",
  robots: { index: false, follow: false },
};

async function loadMedia(
  params: PageProps["params"]
): Promise<ResolvedMedia | null> {
  const { owner, name } = await params;

  try {
    return await resolveMedia(owner, name.join("/"));
  } catch (error) {
    if (error instanceof MediaLookupError && error.status < 500) {
      return null;
    }

    throw error;
  }
}

export default async function EmbedMediaPage({ params }: PageProps) {
  await connection();

  const media = await loadMedia(params);

  if (!media) {
    notFound();
  }

  const title = getFileName(media.blobName);

  const src = mediaStreamPath(media.owner, media.blobName);

  // Covers the app shell so the player fills the whole iframe.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="h-full w-full">
        {media.media.kind === "audio" ? (
          <div className="flex h-full w-full flex-col justify-center gap-2 bg-slate-950 px-4">
            <p className="truncate text-sm font-medium text-white">{title}</p>

            <MediaPlayer kind="audio" src={src} title={title} />
          </div>
        ) : (
          <MediaPlayer
            kind={media.media.kind}
            src={src}
            title={title}
            fill
          />
        )}
      </div>
    </div>
  );
}
