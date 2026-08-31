const reasons = [
  {
    number: "01",
    title: "Developer First",
    description:
      "Designed around the practical workflow of builders working with storage, assets and application infrastructure.",
  },
  {
    number: "02",
    title: "Operational Visibility",
    description:
      "Inspect important storage and development operations instead of treating decentralized infrastructure as a black box.",
  },
  {
    number: "03",
    title: "Project Oriented",
    description:
      "Keep assets, metadata, collections and development resources connected around the work your application is actually doing.",
  },
  {
    number: "04",
    title: "Built for Shelby",
    description:
      "Purpose-built around Shelby workflows rather than adapting a generic file manager or NFT dashboard.",
  },
];

export default function WhyShelbyStudio() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/20">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Why Shelby Studio
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              A workspace built around the work.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
              Shelby Studio focuses on the layer between Shelby
              infrastructure and the applications, creators and
              teams building with it.
            </p>
          </div>

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
