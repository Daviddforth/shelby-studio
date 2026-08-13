const reasons = [
  {
    number: "01",
    title: "Developer First",
    description:
      "Designed around real development workflows so builders can spend less time managing infrastructure and more time creating.",
  },
  {
    number: "02",
    title: "One Connected Workspace",
    description:
      "Projects, storage, metadata and collections work together instead of living across disconnected tools.",
  },
  {
    number: "03",
    title: "Built for Shelby",
    description:
      "Purpose-built around Shelby Storage and the Shelby ecosystem, with workflows designed specifically for applications building on the network.",
  },
];

export default function WhyShelbyStudio() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/20">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Section introduction */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Why Shelby Studio
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Built to simplify building on Shelby.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
              Shelby Studio brings the tools developers use throughout their
              workflow into one focused environment.
            </p>
          </div>

          {/* Reasons */}
          <div className="divide-y divide-slate-800 border-y border-slate-800">
            {reasons.map((reason) => (
              <div
                key={reason.number}
                className="group grid gap-4 py-7 md:grid-cols-[56px_180px_1fr] md:items-start md:gap-6"
              >
                <span className="text-sm font-semibold text-slate-600 transition-colors group-hover:text-blue-400">
                  {reason.number}
                </span>

                <h3 className="text-lg font-semibold text-white">
                  {reason.title}
                </h3>

                <p className="text-sm leading-6 text-slate-400">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
