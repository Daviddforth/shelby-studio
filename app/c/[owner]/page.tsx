import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import MediaThumb from "@/components/media/MediaThumb";

import {
  MediaLookupError,
  listOwnerMedia,
  type OwnerMediaItem,
} from "@/lib/media/server";

import { getFileName, mediaPagePath } from "@/lib/media/types";

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

  const label = shortAddress(decodeURIComponent(owner));

  return {
    title: `Media by ${label} | Shelby Studio`,
    description: `Videos, audio and images hosted on Shelby by ${label}.`,
  };
}

export default async function CreatorPage({ params }: PageProps) {
  await connection();

  const creator = await loadCreator(params);

  if (!creator) {
    notFound();
  }

  const counts = creator.items.reduce(
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
            href="/media"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Host your own media
          </Link>
        </header>

        <section className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
            Creator
          </p>

          <h1 className="mt-2 break-all font-mono text-2xl font-bold text-white sm:text-3xl">
            {shortAddress(creator.owner)}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {creator.items.length === 0
              ? "No public media yet."
              : `${counts.video} video · ${counts.audio} audio · ${counts.image} images, hosted on Shelby`}
          </p>
        </section>

        {creator.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-sm text-slate-500">
            This creator has not uploaded any video, audio or images yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {creator.items.map((item) => {
              const title = getFileName(item.blobName);

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
      </div>
    </main>
  );
}
