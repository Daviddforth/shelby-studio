import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-16 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
          A developer workspace for Shelby
        </div>

        <h1 className="mt-8 max-w-6xl text-4xl font-extrabold sm:text-5xl tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Build, store, explore
          <br />
          <span className="text-blue-400">
            on Shelby.
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-7 sm:text-lg sm:leading-8 text-slate-400 sm:text-xl">
          Shelby Studio brings storage, digital assets, metadata,
          collections, exploration and developer tooling into one
          connected workspace built around Shelby.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-slate-400">
          <span>Storage</span>
          <span className="text-slate-700">•</span>
          <span>Digital Assets</span>
          <span className="text-slate-700">•</span>
          <span>Metadata</span>
          <span className="text-slate-700">•</span>
          <span>Collections</span>
          <span className="text-slate-700">•</span>
          <span>Explorer</span>
          <span className="text-slate-700">•</span>
          <span>Developer Tools</span>
        </div>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-500"
          >
            Launch Workspace →
          </Link>

          <Link
            href="/developer"
            className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-900"
          >
            Explore Developer Tools
          </Link>

          <Link
            href="/docs"
            className="rounded-xl border border-slate-800 px-8 py-4 font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-900"
          >
            Read Docs
          </Link>
        </div>

        <p className="mt-10 text-sm text-slate-500">
          Built for developers, creators, game builders and Web3 teams.
        </p>
      </div>
    </section>
  );
}
