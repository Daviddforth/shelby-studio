import Link from "next/link";

export default function DeveloperPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Developer Surface
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Build with the infrastructure, not around it.
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
            Shelby Studio isn't only a dashboard. Explore supported
            APIs, SDK resources and operations while developing
            applications powered by Shelby.
          </p>

          <Link
            href="/developer"
            className="mt-7 inline-flex rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-500/50 hover:bg-slate-900"
          >
            Explore Developer Tools →
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
            <span className="text-xs font-medium text-slate-400">
              API Playground
            </span>

            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
              Ready
            </span>
          </div>

          <div className="p-5">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs leading-6">
              <p className="text-slate-500">
                // Shelby Studio API
              </p>

              <p className="mt-2">
                <span className="text-blue-400">
                  const
                </span>{" "}
                <span className="text-white">
                  asset
                </span>{" "}
                <span className="text-slate-500">
                  =
                </span>{" "}
                <span className="text-blue-300">
                  await
                </span>{" "}
                <span className="text-white">
                  shelby
                </span>
                <span className="text-slate-400">
                  .storage.upload(
                </span>
              </p>

              <p className="pl-5 text-slate-400">
                file,
              </p>

              <p className="pl-5 text-slate-400">
                metadata
              </p>

              <p className="text-slate-400">
                );
              </p>

              <div className="my-4 border-t border-slate-800" />

              <p className="text-slate-500">
                // Response
              </p>

              <p className="mt-2 text-emerald-400">
                {"{"}
              </p>

              <p className="pl-5 text-slate-400">
                status:{" "}
                <span className="text-emerald-300">
                  &quot;Stored&quot;
                </span>
                ,
              </p>

              <p className="pl-5 text-slate-400">
                network:{" "}
                <span className="text-emerald-300">
                  &quot;Shelbynet&quot;
                </span>
              </p>

              <p className="text-emerald-400">
                {"}"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
