import type { Metadata } from "next";

import Link from "next/link";
import { connection } from "next/server";

import { listLiveStreams } from "@/lib/live/server";
import { getDetailsCounts } from "@/lib/media/db";
import { countProfiles } from "@/lib/profile/db";

export const metadata: Metadata = {
  title: "Stats | Shelby Studio",
  description: "Real numbers from Shelby Studio, counted from its own database.",
};

function Stat({ label, value, note }: { label: string; value: number | null; note: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-white">{value === null ? "—" : value.toLocaleString()}</p>

      <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
    </div>
  );
}

export default async function StatsPage() {
  await connection();

  const [profiles, counts, live] = await Promise.all([
    countProfiles(),
    getDetailsCounts(),
    listLiveStreams().then((list) => list.length).catch(() => null),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-tight text-white">
            Shelby Studio
          </Link>
        </header>

        <h1 className="text-3xl font-bold text-white">Stats</h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Counted live from this site&apos;s database. The file contents themselves are on Shelby, and
          Shelby Studio does not see every file a wallet stores, so these numbers only cover what
          creators have set up here.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Stat label="Creator profiles" value={profiles} note="Wallets that saved a public profile." />

          <Stat label="Creators sharing media" value={counts?.creators ?? null} note="Wallets with at least one titled file." />

          <Stat label="Files shared" value={counts?.files ?? null} note="Files with a title, which also appear on Discover." />

          <Stat label="Live right now" value={live} note="Streams with the host connected at this moment." />
        </div>
      </div>
    </main>
  );
}
