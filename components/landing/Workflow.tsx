const steps = [
  {
    number: "01",
    title: "Create a Project",
    description:
      "Start with a dedicated workspace for your application, assets and development workflow.",
  },
  {
    number: "02",
    title: "Upload Assets",
    description:
      "Store files directly on Shelby and keep them connected to the project you are building.",
  },
  {
    number: "03",
    title: "Create Metadata",
    description:
      "Build and validate structured metadata for the digital assets inside your project.",
  },
  {
    number: "04",
    title: "Organize Collections",
    description:
      "Group related assets and metadata into organized collections from the same workspace.",
  },
  {
    number: "05",
    title: "Build on Shelby",
    description:
      "Use your organized project and stored assets as the foundation for applications powered by Shelby.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="border-y border-slate-800 bg-slate-900/30"
    >
      <div className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Developer Workflow
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            From project to production,
            <br />
            without leaving your workspace.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Shelby Studio connects the core stages of building on
            Shelby into one continuous development experience.
          </p>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-blue-500/60"
            >
              <span className="text-sm font-semibold text-blue-400">
                {step.number}
              </span>

              <h3 className="mt-6 text-xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}