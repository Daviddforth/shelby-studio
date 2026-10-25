import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import MediaPlayer from "@/components/media/MediaPlayer";
import ShareLinks from "@/components/media/ShareLinks";
import ShelbyProof from "@/components/media/ShelbyProof";
import TipButton from "@/components/social/TipButton";
import ViewBeacon from "@/components/social/ViewBeacon";

import { getViewCounts } from "@/lib/social/db";
import { getProfile } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";

import { getDetailsForOwner } from "@/lib/media/db";

import {
  MediaLookupError,
  existingCover,
  resolveMedia,
  type ResolvedMedia,
} from "@/lib/media/server";

import {
  displayTitle,
  getSiteOrigin,
  mediaStreamPath,
  summarize,
  type MediaDetails,
} from "@/lib/media/types";

type PageProps = {
  params: Promise<{
    owner: string;
    name: string[];
  }>;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function shortAddress(address: string) {
  return address.length > 14
    ? `${address.slice(0, 8)}…${address.slice(-6)}`
    : address;
}

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

async function loadDetails(media: ResolvedMedia): Promise<MediaDetails | null> {
  const all = await getDetailsForOwner(media.owner);

  return all[media.blobName] ?? null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await connection();

  let media: ResolvedMedia | null = null;

  try {
    media = await loadMedia(params);
  } catch {
    media = null;
  }

  if (!media) {
    return {
      title: "Media not found | Shelby Studio",
      robots: { index: false },
    };
  }

  const details = await loadDetails(media);

  const title = displayTitle(media.blobName, details);

  const description = details?.description
    ? summarize(details.description)
    : `${title} hosted on Shelby via Shelby Studio.`;

  const streamUrl = `${getSiteOrigin()}${mediaStreamPath(
    media.owner,
    media.blobName
  )}`;

  const cover = await existingCover(media.owner, details?.coverBlob);

  const coverUrl = cover
    ? `${getSiteOrigin()}${mediaStreamPath(media.owner, cover)}`
    : null;

  return {
    metadataBase: new URL(getSiteOrigin()),
    title: `${title} | Shelby Studio`,
    description,
    twitter: {
      card: media.media.kind === "image" || coverUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(media.media.kind === "image"
        ? { images: [streamUrl] }
        : coverUrl
          ? { images: [coverUrl] }
          : {}),
    },
    openGraph: {
      title,
      description,
      siteName: "Shelby Studio",
      ...(media.media.kind === "image"
        ? { images: [{ url: streamUrl }] }
        : coverUrl
          ? { images: [{ url: coverUrl }] }
          : {}),
      ...(media.media.kind === "video"
        ? { videos: [{ url: streamUrl, type: media.media.mime }] }
        : {}),
      ...(media.media.kind === "audio"
        ? { audio: [{ url: streamUrl, type: media.media.mime }] }
        : {}),
    },
  };
}

export default async function PublicMediaPage({ params }: PageProps) {
  await connection();

  const media = await loadMedia(params);

  if (!media) {
    notFound();
  }

  const details = await loadDetails(media);

  const title = displayTitle(media.blobName, details);

  const src = mediaStreamPath(media.owner, media.blobName);

  const cover = await existingCover(media.owner, details?.coverBlob);

  const poster = cover ? mediaStreamPath(media.owner, cover) : undefined;

  const views = (await getViewCounts(media.owner.toLowerCase()))[media.blobName] ?? 0;

  const creatorProfile = await getProfile(media.owner.toLowerCase()).catch(() => null);

  const creatorName = profileLabel(creatorProfile, media.owner);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <ViewBeacon owner={media.owner.toLowerCase()} target={media.blobName} />

      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            Shelby Studio
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Host your own media
          </Link>
        </header>

        <MediaPlayer
          kind={media.media.kind}
          src={src}
          title={title}
          poster={poster}
        />

        <section className="mt-6">
          <h1 className="break-all text-xl font-semibold text-white">
            {title}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {views > 0 ? `${views} views · ` : ""}{formatBytes(media.size)} · Stored on Shelby · Shared by{" "}
            <Link
              href={`/c/${media.owner}`}
              className="font-mono underline-offset-2 hover:text-white hover:underline"
            >
              {shortAddress(media.owner)}
            </Link>
          </p>

          <div className="mt-4">
            <TipButton creator={media.owner.toLowerCase()} name={creatorName} />
          </div>

          {details?.description && (
            <p className="mt-5 max-w-3xl whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
              {details.description}
            </p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-slate-300">
            Share or embed
          </h2>

          <ShareLinks
            owner={media.owner}
            blobName={media.blobName}
            kind={media.media.kind}
          />
        </section>

        <ShelbyProof
          owner={media.owner}
          blobName={media.blobName}
          size={media.size}
          etag={media.etag}
          committedAtMicros={media.committedAtMicros}
        />
      </div>
    </main>
  );
}
