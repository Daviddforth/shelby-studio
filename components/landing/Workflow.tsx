const steps = [
  {
    number: "01",
    title: "Connect to Shelby",
    description:
      "Configure your Shelby environment and establish the storage and application workflow your project needs.",
  },
  {
    number: "02",
    title: "Upload & Store",
    description:
      "Upload digital assets and store them through Shelby while keeping your project organized in one workspace.",
  },
  {
    number: "03",
    title: "Create Metadata",
    description:
      "Build structured metadata, manage attributes and prepare assets for NFT and application workflows.",
  },
  {
    number: "04",
    title: "Explore & Inspect",
    description:
      "Use the Explorer and developer tools to inspect assets, locations, objects and supported API responses.",
  },
  {
    number: "05",
    title: "Build & Integrate",
    description:
      "Use SDK resources, generated examples and API operations as building blocks for applications powered by Shelby.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="border-y border-slate-800 bg-slate-900/20"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Developer Workflow
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            From storage to integration.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400">
            Shelby Studio gives developers a practical path from
            storing assets to inspecting data and integrating Shelby
            into applications.
          </p>
        </div>

        <div className="mt-14">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group grid gap-5 border-t border-slate-800 py-7 md:grid-cols-[72px_220px_1fr] md:items-start md:gap-8"
            >
              <span className="text-sm font-semibold text-slate-600 transition-colors group-hover:text-blue-400">
                {step.number}
              </span>

              <h3 className="text-lg font-semibold text-white">
                {step.title}
              </h3>

              <p className="max-w-xl text-sm leading-6 text-slate-400">
                {step.description}
              </p>
            </div>
          ))}

          <div className="border-t border-slate-800" />
        </div>
      </div>
    </section>
  );
}
