import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { connection } from "next/server";

import WatchBeacon from "@/components/social/WatchBeacon";
import { getPremium } from "@/lib/premium/server";
import { formatApt } from "@/lib/social/types";
import MediaPlayer from "@/components/media/MediaPlayer";
import { ShelbyBadgeLink } from "@/components/media/ShelbyProof";

import { getDetailsForOwner } from "@/lib/media/db";

import {
  MediaLookupError,
  existingCover,
  resolveMedia,
  type ResolvedMedia,
} from "@/lib/media/server";

import { displayTitle, mediaPagePath, mediaStreamPath } from "@/lib/media/types";

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

  const details = (await getDetailsForOwner(media.owner))[media.blobName];

  const title = displayTitle(media.blobName, details);

  const src = mediaStreamPath(media.owner, media.blobName);

  const cover = await existingCover(media.owner, details?.coverBlob);

  const poster = cover ? mediaStreamPath(media.owner, cover) : undefined;

  const premium = await getPremium(media.owner.toLowerCase(), media.blobName);

  if (premium) {
    // The locked bytes are useless to play, so a paid file links to its page to unlock.
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4 text-center">
        <a
          href={mediaPagePath(media.owner, media.blobName)}
          target="_blank"
          rel="noopener"
          className="rounded-2xl border border-amber-500/40 bg-slate-900 px-6 py-5 text-white transition hover:border-amber-400"
        >
          <span className="block text-sm font-semibold">{title}</span>

          <span className="mt-1 block text-xs text-amber-300">Paid file · {formatApt(premium.priceOctas)} APT</span>

          <span className="mt-3 block text-xs text-slate-400">Unlock on Shelby Studio</span>
        </a>
      </div>
    );
  }

  // Covers the app shell so the player fills the whole iframe.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full">
        {media.media.kind !== "image" && <WatchBeacon owner={media.owner.toLowerCase()} target={media.blobName} />}

        <ShelbyBadgeLink href={mediaPagePath(media.owner, media.blobName)} />

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
            poster={poster}
            fill
          />
        )}
      </div>
    </div>
  );
}
