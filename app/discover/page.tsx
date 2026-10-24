import type { Metadata } from "next";

import Link from "next/link";
import { connection } from "next/server";

import { Radio, Users } from "lucide-react";

import MediaThumb from "@/components/media/MediaThumb";

import { listLiveStreams } from "@/lib/live/server";
import { liveWatchPath, type LiveStatus } from "@/lib/live/types";
import { getRecentItems } from "@/lib/media/db";
import { displayTitle, getMediaType, mediaPagePath } from "@/lib/media/types";
import { getProfile } from "@/lib/profile/db";
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

  const [live, recent] = await Promise.all([loadLive(), getRecentItems(24)]);

  const owners = Array.from(new Set([...live.map((l) => l.owner), ...recent.map((r) => r.owner)]));

  const names = new Map<string, string>();

  await Promise.all(
    owners.map(async (owner) => {
      const profile = await getProfile(owner.toLowerCase());

      names.set(owner, profileLabel(profile, owner));
    })
  );

  const items = recent.filter((item) => getMediaType(item.blobName));

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

        <h1 className="text-3xl font-bold text-white">Discover</h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Who is live right now, and the newest media creators have chosen to share. Everything here
          is stored on Shelby.
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
                  className="group rounded-2xl border border-red-500/30 bg-red-500/5 p-4 transition hover:bg-red-500/10"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    Live
                  </span>

                  <p className="mt-3 line-clamp-2 break-words text-base font-semibold text-white">
                    {stream.title || "Live stream"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-400">{names.get(stream.owner)}</p>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <Users size={12} />
                    {stream.viewers} watching
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-400">New uploads</h2>

          {items.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
              Nothing shared yet. Give a file a title in your Library and it appears here.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const kind = getMediaType(item.blobName)!.kind;

                const title = displayTitle(item.blobName, { title: item.title });

                return (
                  <Link
                    key={`${item.owner}/${item.blobName}`}
                    href={mediaPagePath(item.owner, item.blobName)}
                    className="group min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:border-slate-600"
                  >
                    <div className="aspect-video overflow-hidden bg-slate-950">
                      <MediaThumb
                        owner={item.owner}
                        blobName={item.blobName}
                        kind={kind}
                        title={title}
                        coverBlob={item.coverBlob}
                      />
                    </div>

                    <div className="p-4">
                      <p className="truncate text-sm font-semibold text-white group-hover:text-blue-300">
                        {title}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">{names.get(item.owner)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
