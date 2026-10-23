const steps = [
  {
    number: "01",
    title: "Connect",
    description:
      "Connect an Aptos wallet such as Petra. Your wallet address is your creator identity.",
  },
  {
    number: "02",
    title: "Upload",
    description:
      "Upload a video, song or image. Your wallet approves it and the file is stored on Shelby.",
  },
  {
    number: "03",
    title: "Share",
    description:
      "Add a title and cover, then copy the public link or an embed code. Your creator page lists everything.",
  },
  {
    number: "04",
    title: "Go live",
    description:
      "Press Go live, send the link, and your audience watches and chats in their browser.",
  },
  {
    number: "05",
    title: "Build more",
    description:
      "Create NFT collections and metadata, or use the developer tools to connect Shelby to your own app.",
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
            How it works
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            From your first upload to a live audience.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400">
            Five steps from a new wallet to a hosted video and a live
            stream.
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
