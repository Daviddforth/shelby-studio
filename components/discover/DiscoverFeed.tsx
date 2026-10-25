"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Shuffle, Sparkles } from "lucide-react";

import CreatorSearch from "@/components/discover/CreatorSearch";
import MediaThumb from "@/components/media/MediaThumb";

import { mediaPagePath, mediaStreamPath, type MediaKind } from "@/lib/media/types";

export interface FeedItem {
  owner: string;
  blobName: string;
  title: string;
  coverBlob: string | null;
  kind: MediaKind;
  creator: string;
}

export interface FeedCreator {
  owner: string;
  name: string;
  bio: string;
  avatarBlob: string | null;
  live: boolean;
}

const FILTERS: Array<{ id: "all" | MediaKind; label: string }> = [
  { id: "all", label: "Everything" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
  { id: "image", label: "Images" },
];

function Avatar({ creator, size }: { creator: FeedCreator; size: string }) {
  return creator.avatarBlob ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mediaStreamPath(creator.owner, creator.avatarBlob)}
      alt=""
      loading="lazy"
      className={`${size} rounded-full object-cover ring-2 ${creator.live ? "ring-red-500" : "ring-slate-700"}`}
    />
  ) : (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-fuchsia-600 text-lg font-bold text-white ring-2 ${
        creator.live ? "ring-red-500" : "ring-transparent"
      }`}
    >
      {(creator.name[0] || "?").toUpperCase()}
    </div>
  );
}

/** Interactive part of Discover: search, filters, shuffle, spotlight. */
export default function DiscoverFeed({
  items,
  creators,
  spotlightOwner,
}: {
  items: FeedItem[];
  creators: FeedCreator[];
  spotlightOwner: string | null;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | MediaKind>("all");
  const [seed, setSeed] = useState(0);

  const needle = query.trim().toLowerCase();

  const shownCreators = useMemo(
    () =>
      creators.filter(
        (creator) => !needle || creator.name.toLowerCase().includes(needle) || creator.bio.toLowerCase().includes(needle)
      ),
    [creators, needle]
  );

  const shownItems = useMemo(() => {
    const list = items.filter(
      (item) =>
        (filter === "all" || item.kind === filter) &&
        (!needle || item.title.toLowerCase().includes(needle) || item.creator.toLowerCase().includes(needle))
    );

    if (seed === 0) return list;

    // Shuffle with a seeded generator so the order is stable between renders.
    const copy = [...list];

    let state = seed;

    for (let i = copy.length - 1; i > 0; i--) {
      state = (state * 1664525 + 1013904223) % 4294967296;

      const j = state % (i + 1);

      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }, [items, filter, needle, seed]);

  const spotlight = creators.find((creator) => creator.owner === spotlightOwner) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <CreatorSearch value={query} onChange={setQuery} />

        <a
          href="/discover/surprise"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-900/30 transition hover:brightness-110"
        >
          <Sparkles size={15} />
          Surprise me
        </a>
      </div>

      {spotlight && !needle && (
        <Link
          href={`/c/${spotlight.owner}`}
          className="group relative mt-8 flex flex-col gap-4 overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-600/20 via-indigo-600/10 to-transparent p-6 transition hover:border-fuchsia-400/60 sm:flex-row sm:items-center"
        >
          <Avatar creator={spotlight} size="h-20 w-20" />

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-fuchsia-300">Creator spotlight</p>

            <p className="mt-1 truncate text-2xl font-bold text-white">{spotlight.name}</p>

            {spotlight.bio && <p className="mt-1 line-clamp-2 text-sm text-slate-300">{spotlight.bio}</p>}
          </div>

          <span className="text-sm font-medium text-fuchsia-200 transition group-hover:translate-x-1 sm:ml-auto">
            Visit page →
          </span>
        </Link>
      )}

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Creators</h2>

        {shownCreators.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
            {needle
              ? "No creators match that."
              : "No creator profiles yet. Add your name on the Profile page and you will show up here."}
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shownCreators.map((creator) => (
              <Link
                key={creator.owner}
                href={`/c/${creator.owner}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:-translate-y-0.5 hover:border-slate-600"
              >
                <Avatar creator={creator} size="h-12 w-12" />

                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-semibold text-white">
                    {creator.name}
                    {creator.live && (
                      <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase">Live</span>
                    )}
                  </p>

                  <p className="truncate text-xs text-slate-500">{creator.bio || "Hosting on Shelby"}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-400">New uploads</h2>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setFilter(entry.id)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  filter === entry.id
                    ? "border-blue-500 bg-blue-500/15 text-white"
                    : "border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                {entry.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSeed((value) => value + 7919)}
              className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:text-white"
            >
              <Shuffle size={12} />
              Shuffle
            </button>
          </div>
        </div>

        {shownItems.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
            {items.length === 0
              ? "Nothing shared yet. Give a file a title in your Library and it appears here."
              : "Nothing matches. Try another filter."}
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shownItems.map((item) => (
              <Link
                key={`${item.owner}/${item.blobName}`}
                href={mediaPagePath(item.owner, item.blobName)}
                className="group min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-0.5 hover:border-slate-600"
              >
                <div className="aspect-video overflow-hidden bg-slate-950">
                  <MediaThumb
                    owner={item.owner}
                    blobName={item.blobName}
                    kind={item.kind}
                    title={item.title}
                    coverBlob={item.coverBlob}
                  />
                </div>

                <div className="p-4">
                  <p className="truncate text-sm font-semibold text-white group-hover:text-blue-300">{item.title}</p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {item.creator} · <span className="capitalize">{item.kind}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
