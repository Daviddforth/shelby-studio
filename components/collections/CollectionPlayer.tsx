"use client";

import { useState } from "react";

import { Music, Play } from "lucide-react";

import { mediaStreamPath, type MediaKind } from "@/lib/media/types";

export interface PlayerItem {
  blobName: string;
  title: string;
  kind: MediaKind;
  coverBlob: string | null;
}

/** Plays a collection from top to bottom. Video and audio move to the next file when one ends. */
export default function CollectionPlayer({ owner, items }: { owner: string; items: PlayerItem[] }) {
  const [index, setIndex] = useState(0);

  const current = items[index];

  if (!current) return null;

  const src = mediaStreamPath(owner, current.blobName);

  const poster = current.coverBlob ? mediaStreamPath(owner, current.coverBlob) : undefined;

  const next = () => setIndex((value) => (value + 1 < items.length ? value + 1 : value));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0">
        {current.kind === "video" && (
          <video
            key={src}
            src={src}
            poster={poster}
            controls
            autoPlay={index > 0}
            playsInline
            onEnded={next}
            className="aspect-video w-full rounded-2xl bg-black object-contain"
          />
        )}

        {current.kind === "audio" && (
          <div>
            {poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt={current.title} className="mb-4 aspect-square w-full max-w-xs rounded-2xl object-cover" />
            )}

            <audio key={src} src={src} controls autoPlay={index > 0} onEnded={next} className="w-full" />
          </div>
        )}

        {current.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={current.title} className="max-h-[75vh] w-full rounded-2xl object-contain" />
        )}

        <p className="mt-4 break-words text-lg font-semibold text-white">{current.title}</p>

        <p className="mt-1 text-xs text-slate-500">
          {index + 1} of {items.length}
        </p>
      </div>

      <ol className="max-h-[32rem] space-y-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-2">
        {items.map((item, position) => (
          <li key={item.blobName}>
            <button
              type="button"
              onClick={() => setIndex(position)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                position === index ? "bg-blue-500/15 text-white" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-xs text-slate-500">
                {position === index ? <Play size={14} className="text-blue-400" /> : position + 1}
              </span>

              <span className="min-w-0 flex-1 truncate">{item.title}</span>

              {item.kind === "audio" && <Music size={13} className="shrink-0 text-slate-500" />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
