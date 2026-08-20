const features = [
  {
    number: "01",
    title: "Shelby Storage",
    description:
      "Upload, store, retrieve and manage digital assets through Shelby from a connected workspace.",
  },
  {
    number: "02",
    title: "Asset Explorer",
    description:
      "Inspect assets, metadata and storage information through an interface designed for exploring Shelby-backed data.",
  },
  {
    number: "03",
    title: "Metadata & Collections",
    description:
      "Create structured NFT metadata, manage attributes and organize related assets into collections.",
  },
  {
    number: "04",
    title: "Developer Tools",
    description:
      "Use the API Playground, SDK Explorer, Code Generator and examples to explore the Shelby Studio developer surface.",
  },
  {
    number: "05",
    title: "Live API Operations",
    description:
      "Execute supported Shelby Studio API operations and inspect JSON responses directly from the developer workspace.",
  },
  {
    number: "06",
    title: "One Connected Workspace",
    description:
      "Bring storage, assets, metadata, collections and development workflows together instead of managing disconnected tools.",
  },
];

export default function PlatformOverview() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            The Platform
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            One workspace for building on Shelby.
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
            Shelby Studio connects storage, assets, metadata,
            collections and developer workflows in one focused
            environment.
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
