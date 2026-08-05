export default function PlatformOverview() {
  const features = [
    {
      icon: "📦",
      title: "Manage Assets",
      description:
        "Upload, organize and retrieve decentralized assets securely through Shelby Storage.",
    },
    {
      icon: "🧬",
      title: "Create Metadata",
      description:
        "Generate production-ready NFT metadata with structured attributes, validation and export-ready JSON.",
    },
    {
      icon: "🗂",
      title: "Organize Projects",
      description:
        "Keep assets, metadata and collections together inside dedicated project workspaces.",
    },
    {
      icon: "🚀",
      title: "Build Faster",
      description:
        "Reduce repetitive workflows with integrated tools designed specifically for developers building on Shelby.",
    },
  ];

  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-6 py-28"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          The Platform
        </p>

        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Everything you need to build on Shelby.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Storage, metadata, projects and developer tools—all
          in one integrated workspace.
        </p>
      </div>

      {/* Platform Features */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-3xl border border-slate-800 bg-slate-900 p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-500/60"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-2xl">
              {feature.icon}
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-white">
              {feature.title}
            </h3>

            <p className="mt-4 max-w-xl leading-7 text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}