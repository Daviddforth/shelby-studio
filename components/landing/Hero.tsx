export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 top-24 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        {/* Eyebrow */}
        <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
          Built for the Shelby ecosystem
        </div>

        {/* Heading */}
        <h1 className="mt-8 max-w-5xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Build on Shelby.
          <br />
          <span className="text-blue-400">Everything in one workspace.</span>
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400 sm:text-xl">
          Shelby Studio is a creator and developer workspace for building,
          organizing, storing, publishing, and exploring digital assets on
          Shelby.
        </p>

        {/* What users can do */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
          <span>Projects</span>
          <span className="text-slate-700">•</span>
          <span>Decentralized Storage</span>
          <span className="text-slate-700">•</span>
          <span>Asset Explorer</span>
          <span className="text-slate-700">•</span>
          <span>Metadata</span>
          <span className="text-slate-700">•</span>
          <span>Collections</span>
          <span className="text-slate-700">•</span>
          <span>Developer Tools</span>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Launch Workspace →
          </a>

          <a
            href="#features"
            className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-900"
          >
            Explore Features
          </a>
        </div>

        {/* Audience */}
        <p className="mt-10 text-sm text-slate-500">
          Built for developers, game builders, artists, creators, and Web3
          teams.
        </p>
      </div>
    </section>
  );
}
