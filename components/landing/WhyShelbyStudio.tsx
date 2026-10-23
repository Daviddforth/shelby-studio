const reasons = [
  {
    number: "01",
    title: "You own it",
    description:
      "Files are stored on Shelby and tied to your wallet. Only your wallet can change or delete them. There are no passwords to leak.",
  },
  {
    number: "02",
    title: "One link",
    description:
      "A page for every file, an embed code for your site, and one creator page you can put in your bio.",
  },
  {
    number: "03",
    title: "Live in one click",
    description:
      "Go live from the browser. Anyone with the link can watch and chat, with no account or app to install.",
  },
  {
    number: "04",
    title: "Built for Shelby",
    description:
      "Made around Shelby's fast reads, so a hosted video can be streamed and seeked like it would on any media site.",
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
              A home for creators who own their content.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
              Shelby Studio is the layer between Shelby storage and the
              people who make things: simple tools, public pages and live
              streaming on top of storage you own.
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
