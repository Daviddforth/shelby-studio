import Link from "next/link";

export default function CTA() {
  return (
    <section className="border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 px-5 py-14 text-center sm:px-8 md:px-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Start creating
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Upload it. Share it. Go live.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400">
              Connect your wallet and put your first video, song or
              image on Shelby in a few minutes.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Start creating →
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-950"
              >
                Contact Us
              </Link>

              <Link
                href="/docs"
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-950"
              >
                Read the Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
