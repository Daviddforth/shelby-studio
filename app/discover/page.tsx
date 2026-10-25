import type { Metadata } from "next";

import Link from "next/link";
import { connection } from "next/server";

import { Radio, Users } from "lucide-react";

import DiscoverFeed, { type FeedCreator, type FeedItem } from "@/components/discover/DiscoverFeed";

import { listLiveStreams } from "@/lib/live/server";
import { liveWatchPath, type LiveStatus } from "@/lib/live/types";
import { getRecentItems } from "@/lib/media/db";
import { displayTitle, getMediaType } from "@/lib/media/types";
import { listProfiles } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";

export const metadata: Metadata = {
  title: "Discover | Shelby Studio",
  description: "Who is live right now, and the newest videos, audio and images hosted on Shelby.",
  openGraph: {
    title: "Discover on Shelby Studio",
    description: "Who is live right now, and the newest media hosted on Shelby.",
    siteName: "Shelby Studio",
  },
  twitter: { card: "summary", title: "Discover on Shelby Studio" },
};

/** A different creator on each visit. */
function pickOwner(list: FeedCreator[]): string | null {
  return list.length > 0 ? list[Math.floor(Math.random() * list.length)].owner : null;
}

async function loadLive(): Promise<LiveStatus[]> {
  try {
    return await listLiveStreams();
  } catch {
    // Live not configured or unreachable: Discover still works without it.
    return [];
  }
}

export default async function DiscoverPage() {
  await connection();

  const [live, recent, profiles] = await Promise.all([loadLive(), getRecentItems(60), listProfiles(48)]);

  const profileByOwner = new Map(profiles.map((profile) => [profile.owner.toLowerCase(), profile]));

  const liveOwners = new Set(live.map((stream) => stream.owner.toLowerCase()));

  const nameOf = (owner: string) => profileLabel(profileByOwner.get(owner.toLowerCase()) ?? null, owner);

  const items: FeedItem[] = recent.flatMap((item) => {
    const media = getMediaType(item.blobName);

    return media
      ? [
          {
            owner: item.owner,
            blobName: item.blobName,
            title: displayTitle(item.blobName, { title: item.title }),
            coverBlob: item.coverBlob,
            kind: media.kind,
            creator: nameOf(item.owner),
          },
        ]
      : [];
  });

  const creators: FeedCreator[] = profiles.map((profile) => ({
    owner: profile.owner,
    name: profile.displayName,
    bio: profile.bio,
    avatarBlob: profile.avatarBlob,
    live: liveOwners.has(profile.owner.toLowerCase()),
  }));

  // A different creator in the spotlight on each visit, favouring ones with a picture.
  const pool = creators.filter((creator) => creator.avatarBlob);

  const choices = pool.length > 0 ? pool : creators;

  const spotlightOwner = pickOwner(choices);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            Shelby Studio
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Host your own media
          </Link>
        </header>

        <h1 className="bg-gradient-to-r from-white via-fuchsia-200 to-indigo-300 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
          Discover
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Find creators, catch a live stream, or let us surprise you. Everything here is stored on Shelby
          and shared by the people who made it.
        </p>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-red-400">
            <Radio size={14} />
            Live now
          </h2>

          {live.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
              Nobody is live at the moment.{" "}
              <Link href="/live" className="text-blue-400 hover:underline">
                Be the first to go live
              </Link>
              .
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((stream) => (
                <Link
                  key={stream.code}
                  href={liveWatchPath(stream.code)}
                  className="group rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent p-4 transition hover:-translate-y-0.5 hover:border-red-400/60"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    Live
                  </span>

                  <p className="mt-3 line-clamp-2 break-words text-base font-semibold text-white">
                    {stream.title || "Live stream"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">{nameOf(stream.owner)}</p>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <Users size={12} />
                    {stream.viewers} watching
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="mt-12">
          <DiscoverFeed items={items} creators={creators} spotlightOwner={spotlightOwner} />
        </div>
      </div>
    </main>
  );
}
