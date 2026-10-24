import type { Metadata } from "next";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

import LiveViewer from "@/components/live/LiveViewer";

import { getLiveStatus, getStreamOwner, normalizeOwner } from "@/lib/live/server";
import { isStreamCode, liveWatchPath } from "@/lib/live/types";
import { getProfile } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";

type PageProps = {
  params: Promise<{ code: string }>;
};

export const metadata: Metadata = {
  title: "Live | Shelby Studio",
  description: "Watch a live stream on Shelby Studio.",
  robots: { index: false },
};

export default async function WatchLivePage({ params }: PageProps) {
  await connection();

  const { code: raw } = await params;

  const ref = decodeURIComponent(raw);

  // Old links that used a wallet address: send them to the current stream, if any.
  if (!isStreamCode(ref)) {
    if (!normalizeOwner(ref)) notFound();

    const status = await getLiveStatus(ref).catch(() => null);

    if (status?.live && status.code) redirect(liveWatchPath(status.code));

    notFound();
  }

  const owner = await getStreamOwner(ref);

  const profile = owner ? await getProfile(owner.toLowerCase()) : null;

  const label = owner ? profileLabel(profile, owner) : "";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            Shelby Studio
          </Link>

          {owner && (
            <Link
              href={`/c/${owner}`}
              className="max-w-[50%] truncate text-xs text-slate-400 transition hover:text-white"
            >
              {label}
            </Link>
          )}
        </header>

        <LiveViewer code={ref} />
      </div>
    </main>
  );
}
