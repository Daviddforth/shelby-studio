import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import LiveViewer from "@/components/live/LiveViewer";

import { normalizeOwner } from "@/lib/live/server";

type PageProps = {
  params: Promise<{ owner: string }>;
};

function shortAddress(address: string) {
  return address.length > 14
    ? `${address.slice(0, 8)}…${address.slice(-6)}`
    : address;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner } = await params;

  const label = shortAddress(decodeURIComponent(owner));

  return {
    title: `Live: ${label} | Shelby Studio`,
    description: `Watch ${label} live on Shelby Studio.`,
  };
}

export default async function WatchLivePage({ params }: PageProps) {
  const { owner: raw } = await params;

  const owner = normalizeOwner(decodeURIComponent(raw));

  if (!owner) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            Shelby Studio
          </Link>

          <Link
            href={`/c/${owner}`}
            className="font-mono text-xs text-slate-400 transition hover:text-white"
          >
            {shortAddress(owner)}
          </Link>
        </header>

        <LiveViewer owner={owner} />
      </div>
    </main>
  );
}
