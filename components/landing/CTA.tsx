import Link from "next/link";

export default function CTA() {
  return (
    <section className="border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center md:px-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Start Building
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Your next project can start here.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400">
              Create a project, manage your assets, and build your workflow
              around Shelby from one workspace.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Launch Workspace →
              </Link>

              <Link
                href="/docs"
                className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-950"
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
