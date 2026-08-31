const steps = [
  {
    number: "01",
    title: "Connect",
    description:
      "Connect your wallet and establish the Shelby environment for your project.",
  },
  {
    number: "02",
    title: "Store",
    description:
      "Upload digital assets and manage Shelby-backed storage from your workspace.",
  },
  {
    number: "03",
    title: "Structure",
    description:
      "Create metadata, attributes and collections around the assets your application needs.",
  },
  {
    number: "04",
    title: "Inspect",
    description:
      "Explore assets, storage information and supported Shelby data through the Explorer.",
  },
  {
    number: "05",
    title: "Integrate",
    description:
      "Use APIs, SDK resources and generated examples to take your Shelby workflow into your application.",
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
            Quick Start
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            From your first asset to your application.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400">
            A practical workflow for teams building applications,
            collections and digital experiences with Shelby.
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
