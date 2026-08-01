import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm text-blue-300">
          Built for the Shelby Ecosystem
        </span>

        <h1 className="mt-8 text-5xl font-extrabold tracking-tight md:text-7xl">
          Shelby NFT
          <br />
          Metadata Manager
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Create, preview, validate and store NFT metadata using Shelby
          Storage. Built for NFT creators, developers and Web3 teams.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/app"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
          >
            Launch App →
          </Link>

          <Link
            href="/docs"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
          >
            Documentation
          </Link>

          <Link
            href="https://github.com/Daviddforth/shelby-nft-metadata-manager"
            target="_blank"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
          >
            GitHub
          </Link>
        </div>
      </section>
    </main>
  );
}