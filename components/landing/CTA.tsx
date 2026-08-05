import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-blue-500/20 bg-slate-900 px-6 py-20 text-center md:px-12 md:py-24">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Start Building
          </p>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Ready to build on Shelby?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Create a project, store your assets and bring your
            development workflow together inside Shelby Studio.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Launch Workspace →
            </Link>

            <a
              href="#workflow"
              className="rounded-xl border border-slate-700 bg-slate-950/50 px-7 py-3.5 font-semibold text-white transition hover:border-slate-600 hover:bg-slate-950"
            >
              View Workflow
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}