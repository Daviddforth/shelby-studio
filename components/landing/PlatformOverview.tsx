const features = [
  {
    number: "01",
    title: "Storage",
    description:
      "Upload, store and retrieve digital assets through Shelby while keeping the workflow organized inside your project.",
  },
  {
    number: "02",
    title: "Asset Management",
    description:
      "Inspect files, storage information, ownership and publication details from a single asset workspace.",
  },
  {
    number: "03",
    title: "Metadata",
    description:
      "Create structured NFT metadata, manage attributes and prepare records for applications and collections.",
  },
  {
    number: "04",
    title: "Collections",
    description:
      "Group related assets and metadata into organized collections for NFT and application workflows.",
  },
  {
    number: "05",
    title: "Explorer",
    description:
      "Inspect Shelby-backed objects and published data through an interface designed around the underlying storage model.",
  },
  {
    number: "06",
    title: "Developer Tools",
    description:
      "Explore APIs, SDK resources, generated examples and supported operations without leaving the development workspace.",
  },
];

export default function PlatformOverview() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Platform
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            The tools around your Shelby workflow.
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
            From the first upload to application integration,
            Shelby Studio brings the operational pieces together
            without hiding the infrastructure underneath.
          </p>
        </div>

        <div className="divide-y divide-slate-800 border-y border-slate-800">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group grid gap-4 py-7 transition-colors md:grid-cols-[64px_1fr] md:gap-6"
            >
              <span className="text-sm font-medium text-slate-600 transition-colors group-hover:text-blue-400">
                {feature.number}
              </span>

              <div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
