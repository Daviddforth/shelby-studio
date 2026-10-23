import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          Creator workspace built on Shelby
        </div>

        <h1 className="mt-8 max-w-5xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Your content.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Your link. Your wallet.
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-base leading-7 text-slate-400 sm:text-xl sm:leading-8">
          Upload video, audio and images to Shelby, share them with one
          link, and go live for anyone to watch. Everything is stored on
          Shelby and belongs to your wallet, not a platform.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
          <span>Upload</span>
          <span>•</span>
          <span>Share</span>
          <span>•</span>
          <span>Embed</span>
          <span>•</span>
          <span>Go live</span>
          <span>•</span>
          <span>Own it</span>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-500"
          >
            Start creating →
          </Link>

          <Link
            href="/live"
            className="rounded-xl bg-red-600 px-7 py-3.5 font-semibold text-white transition hover:bg-red-500"
          >
            Go live
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
            Independent project
          </span>

          <span>•</span>

          <span>Built for the Shelby ecosystem</span>
        </div>
      </div>
    </section>
  );
}
