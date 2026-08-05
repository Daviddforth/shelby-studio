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
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        {/* Section introduction */}
        <div className="lg:sticky lg:top-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Why Shelby Studio
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Built to simplify
            <br />
            building on Shelby.
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Shelby Studio brings the tools developers use throughout
            their workflow into one focused environment.
          </p>
        </div>

        {/* Reasons */}
        <div className="space-y-4">
          {reasons.map((reason) => (
            <div
              key={reason.number}
              className="group rounded-3xl border border-slate-800 bg-slate-900 p-8 transition duration-300 hover:border-blue-500/50"
            >
              <div className="flex gap-6">
                <span className="shrink-0 text-sm font-semibold text-blue-400">
                  {reason.number}
                </span>

                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {reason.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}