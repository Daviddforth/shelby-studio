export default function PlatformOverview() {
  const features = [
    {
      number: "01",
      title: "Assets & Storage",
      description:
        "Upload, manage, explore and retrieve digital assets using Shelby storage.",
    },
    {
      number: "02",
      title: "Projects",
      description:
        "Keep assets, metadata, collections and development activity organized in one workspace.",
    },
    {
      number: "03",
      title: "Metadata & Collections",
      description:
        "Prepare NFT metadata, manage attributes and organize related assets into collections.",
    },
    {
      number: "04",
      title: "Developer Tools",
      description:
        "Explore Shelby capabilities through developer-focused tools, APIs, SDK resources and examples.",
    },
  ];

  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Section Header */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            The Platform
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            One workspace for building on Shelby.
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
            Bring your projects, assets, storage, metadata and development
            workflows together without jumping between different tools.
          </p>
        </div>

        {/* Features */}
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
