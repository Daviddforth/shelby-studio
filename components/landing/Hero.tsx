import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          Developer workspace for Shelby
        </div>

        <h1 className="mt-8 max-w-5xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Build, store and
          <br />
          <span className="text-blue-400">
            ship on Shelby.
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-7 text-slate-400 sm:text-xl sm:leading-8">
          Shelby Studio gives developers and creators a focused
          workspace for managing digital assets, metadata,
          collections, storage and Shelby-powered development
          workflows.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <span>Storage</span>
          <span>•</span>
          <span>Assets</span>
          <span>•</span>
          <span>Metadata</span>
          <span>•</span>
          <span>Collections</span>
          <span>•</span>
          <span>Explorer</span>
          <span>•</span>
          <span>Developer Tools</span>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
          >
            Launch Workspace →
          </Link>

          <Link
            href="/developer"
            className="rounded-xl border border-slate-700 px-7 py-3.5 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-900"
          >
            Developer Tools
          </Link>

          <Link
            href="/docs"
            className="rounded-xl border border-slate-800 px-7 py-3.5 font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-900"
          >
            Read Docs
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full border border-slate-800 px-3 py-1">
            Developer Preview
          </span>

          <span>•</span>

          <span>Built for the Shelby ecosystem</span>
        </div>
      </div>
    </section>
  );
}
