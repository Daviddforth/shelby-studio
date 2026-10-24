import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getLiveStatus } from "@/lib/live/server";
import { liveWatchPath, OFFLINE } from "@/lib/live/types";

import MediaThumb from "@/components/media/MediaThumb";
import ReportButton from "@/components/report/ReportButton";

import { getDetailsForOwner } from "@/lib/media/db";
import { getProfile } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";

import {
  MediaLookupError,
  listOwnerMedia,
  type OwnerMediaItem,
} from "@/lib/media/server";

import { displayTitle, getSiteOrigin, mediaPagePath, mediaStreamPath } from "@/lib/media/types";

type PageProps = {
  params: Promise<{
    owner: string;
  }>;
};

function shortAddress(address: string) {
  return address.length > 14
    ? `${address.slice(0, 8)}…${address.slice(-6)}`
    : address;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

async function loadCreator(params: PageProps["params"]) {
  const { owner } = await params;

  try {
    return await listOwnerMedia(owner);
  } catch (error) {
    if (error instanceof MediaLookupError && error.status < 500) {
      return null;
    }

    throw error;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { owner } = await params;

  const decoded = decodeURIComponent(owner);

  const profile = await getProfile(decoded.toLowerCase()).catch(() => null);

  const label = profileLabel(profile, decoded);

  const description =
    profile?.bio?.slice(0, 160) || `Videos, audio and images hosted on Shelby by ${label}.`;

  const avatar = profile?.avatarBlob
    ? `${getSiteOrigin()}${mediaStreamPath(decoded.toLowerCase(), profile.avatarBlob)}`
    : null;

  return {
    title: `${label} | Shelby Studio`,
    description,
    openGraph: {
      title: label,
      description,
      siteName: "Shelby Studio",
      ...(avatar ? { images: [{ url: avatar }] } : {}),
    },
    twitter: {
      card: avatar ? "summary_large_image" : "summary",
      title: label,
      description,
      ...(avatar ? { images: [avatar] } : {}),
    },
  };
}

export default async function CreatorPage({ params }: PageProps) {
  await connection();

  const creator = await loadCreator(params);

  if (!creator) {
    notFound();
  }

  const details = await getDetailsForOwner(creator.owner);

  const profile = await getProfile(creator.owner.toLowerCase());

  const name = profileLabel(profile, creator.owner);

  // A missing or unreachable live service must never break the creator page.
  const live = await getLiveStatus(creator.owner).catch(() => OFFLINE);

  // Images chosen as another file's cover are part of that file's page,
  // so they are not listed as separate items.
  const imageNames = new Set(
    creator.items
      .filter((item) => item.media.kind === "image")
      .map((item) => item.blobName)
  );

  const coverBlobs = new Set(
    Object.values(details)
      .map((entry) => entry.coverBlob)
      .filter((blob): blob is string => Boolean(blob) && imageNames.has(blob as string))
  );

  const items = creator.items.filter(
    (item) => !coverBlobs.has(item.blobName)
  );

  const counts = items.reduce(
    (total, item: OwnerMediaItem) => {
      total[item.media.kind] += 1;
      return total;
    },
    { video: 0, audio: 0, image: 0 }
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-white"
          >
            Shelby Studio
          </Link>

          <Link
            href="/library"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Host your own media
          </Link>
        </header>

        {live.live && live.code && (
          <Link
            href={liveWatchPath(live.code)}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 transition hover:bg-red-500/15"
          >
            <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live now
            </span>

            <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
              {live.title || "Live stream"}
            </span>

            <span className="shrink-0 text-xs text-slate-300">
              Watch · {live.viewers}
            </span>
          </Link>
        )}

        <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 shrink-0">
            {profile?.avatarBlob ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaStreamPath(creator.owner, profile.avatarBlob)}
                alt={name}
                className={`h-24 w-24 rounded-full object-cover ${
                  live.live ? "ring-4 ring-red-500" : "ring-2 ring-slate-700"
                }`}
              />
            ) : (
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-bold text-white ${
                  live.live ? "ring-4 ring-red-500" : ""
                }`}
              >
                {(profile?.displayName?.trim()[0] || creator.owner.replace(/^0x/, "")[0] || "?").toUpperCase()}
              </div>
            )}

            {live.live && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                Live
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h1
              className={`break-words text-2xl font-bold text-white sm:text-3xl ${
                profile?.displayName ? "" : "font-mono"
              }`}
            >
              {name}
            </h1>

            {profile?.displayName && (
              <p className="mt-1 font-mono text-xs text-slate-500">{shortAddress(creator.owner)}</p>
            )}

            {profile?.bio && (
              <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-6 text-slate-300">
                {profile.bio}
              </p>
            )}

            {(profile?.website || profile?.twitter || profile?.github) && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener nofollow ugc"
                    className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:text-white"
                  >
                    {profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}

                {profile.twitter && (
                  <a
                    href={`https://x.com/${profile.twitter}`}
                    target="_blank"
                    rel="noopener nofollow ugc"
                    className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:text-white"
                  >
                    X @{profile.twitter}
                  </a>
                )}

                {profile.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener nofollow ugc"
                    className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:text-white"
                  >
                    GitHub {profile.github}
                  </a>
                )}
              </div>
            )}

            <p className="mt-3 text-sm text-slate-400">
              {items.length === 0
                ? "No public media yet."
                : `${counts.video} video · ${counts.audio} audio · ${counts.image} images, hosted on Shelby`}
            </p>
          </div>
        </section>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-sm text-slate-500">
            This creator has not uploaded any video, audio or images yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const itemDetails = details[item.blobName];

              const title = displayTitle(item.blobName, itemDetails);

              return (
                <Link
                  key={item.blobName}
                  href={mediaPagePath(creator.owner, item.blobName)}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:border-slate-600"
                >
                  <div className="aspect-video overflow-hidden bg-slate-950">
                    <MediaThumb
                      owner={creator.owner}
                      blobName={item.blobName}
                      kind={item.media.kind}
                      title={title}
                      coverBlob={
                        itemDetails?.coverBlob && imageNames.has(itemDetails.coverBlob)
                          ? itemDetails.coverBlob
                          : null
                      }
                    />
                  </div>

                  <div className="p-4">
                    <p className="truncate text-sm font-semibold text-white group-hover:text-blue-300">
                      {title}
                    </p>

                    <p className="mt-1 text-xs capitalize text-slate-500">
                      {item.media.kind} · {formatBytes(item.size)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 border-t border-slate-800 pt-4">
          <ReportButton kind="creator" target={`/c/${creator.owner}`} label="Report this page" />
        </div>
      </div>
    </main>
  );
}
