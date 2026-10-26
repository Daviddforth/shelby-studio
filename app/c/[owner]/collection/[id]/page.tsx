import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import CollectionPlayer, { type PlayerItem } from "@/components/collections/CollectionPlayer";
import ReportButton from "@/components/report/ReportButton";
import TipButton from "@/components/social/TipButton";

import { getCollection } from "@/lib/collections/db";
import { COLLECTION_ID_RE, collectionPath } from "@/lib/collections/types";
import { normalizeOwner } from "@/lib/live/server";
import { getDetailsForOwner } from "@/lib/media/db";
import { MediaLookupError, listOwnerMedia } from "@/lib/media/server";
import { displayTitle } from "@/lib/media/types";
import { getProfile } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";

type PageProps = { params: Promise<{ owner: string; id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner: rawOwner, id } = await params;

  const owner = normalizeOwner(decodeURIComponent(rawOwner));

  const collection = owner && COLLECTION_ID_RE.test(id) ? await getCollection(owner, id) : null;

  if (!collection) return { title: "Collection | Shelby Studio" };

  return {
    title: `${collection.title} | Shelby Studio`,
    description: collection.description || `A collection of ${collection.items.length} files hosted on Shelby.`,
    openGraph: { title: collection.title, description: collection.description, siteName: "Shelby Studio" },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  await connection();

  const { owner: rawOwner, id } = await params;

  const owner = normalizeOwner(decodeURIComponent(rawOwner));

  if (!owner || !COLLECTION_ID_RE.test(id)) notFound();

  const collection = await getCollection(owner, id);

  if (!collection) notFound();

  let existing;

  try {
    existing = await listOwnerMedia(owner);
  } catch (error) {
    if (error instanceof MediaLookupError && error.status < 500) notFound();

    throw error;
  }

  const [details, profile] = await Promise.all([getDetailsForOwner(owner), getProfile(owner).catch(() => null)]);

  const byName = new Map(existing.items.map((item) => [item.blobName, item]));

  // Files the creator deleted since are skipped instead of breaking the playlist.
  const items: PlayerItem[] = collection.items.flatMap((blobName) => {
    const item = byName.get(blobName);

    if (!item) return [];

    return [
      {
        blobName,
        title: displayTitle(blobName, details[blobName]),
        kind: item.media.kind,
        coverBlob: details[blobName]?.coverBlob && byName.has(details[blobName].coverBlob as string) ? (details[blobName].coverBlob as string) : null,
      },
    ];
  });

  const name = profileLabel(profile, owner);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            Shelby Studio
          </Link>

          <Link href={`/c/${owner}`} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:text-white">
            {name}
          </Link>
        </header>

        <h1 className="break-words text-2xl font-bold text-white sm:text-3xl">{collection.title}</h1>

        {collection.description && (
          <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-6 text-slate-400">{collection.description}</p>
        )}

        <p className="mt-2 text-xs text-slate-500">
          {items.length} {items.length === 1 ? "file" : "files"} by{" "}
          <Link href={`/c/${owner}`} className="text-slate-300 hover:underline">
            {name}
          </Link>
          , hosted on Shelby
        </p>

        <div className="mt-6">
          {items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-700 p-10 text-center text-sm text-slate-500">
              The files in this collection are no longer available.
            </p>
          ) : (
            <CollectionPlayer owner={owner} items={items} />
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <TipButton creator={owner} name={name} />
        </div>

        <div className="mt-12 border-t border-slate-800 pt-4">
          <ReportButton kind="creator" target={collectionPath(owner, id)} label="Report this collection" />
        </div>
      </div>
    </main>
  );
}
