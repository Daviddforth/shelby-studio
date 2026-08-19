const steps = [
  {
    number: "01",
    title: "Upload Assets",
    description:
      "Start with a dedicated workspace for your application, assets, and development workflow.",
  },
  {
    number: "02",
    title: "Upload Assets",
    description:
      "Store files on Shelby and keep them organized in your workspace.",
  },
  {
    number: "03",
    title: "Create Metadata",
    description:
      "Build and validate structured metadata for your digital assets.",
  },
  {
    number: "04",
    title: "Organize Collections",
    description:
      "Group related assets and metadata into organized collections.",
  },
  {
    number: "05",
    title: "Build on Shelby",
    description:
      "Use your stored assets and metadata as the foundation for applications powered by Shelby.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="border-y border-slate-800 bg-slate-900/20"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Developer Workflow
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            From assets to a Shelby-powered workflow.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400">
            Shelby Studio brings the core stages of your workflow together so
            you can move from asset setup to building without constantly
            switching tools.
          </p>
        </div>

        {/* Workflow */}
        <div className="mt-14">
          {steps.map((step, index) => (
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
