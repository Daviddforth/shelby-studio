const features = [
  {
    number: "01",
    title: "Upload and host",
    description:
      "Put videos, songs and images on Shelby. Your wallet approves the upload, so the file is yours.",
  },
  {
    number: "02",
    title: "Share and embed",
    description:
      "Every file gets its own public page and an embed code you can paste into your own site, with a title, description and cover picture.",
  },
  {
    number: "03",
    title: "Go live",
    description:
      "Start a live stream from your camera or screen and send one link. Viewers watch and chat in the browser, with no account.",
  },
  {
    number: "04",
    title: "Your creator page",
    description:
      "One page that lists everything you host and shows a LIVE NOW banner while you stream. Put it in your social bio.",
  },
  {
    number: "05",
    title: "NFT tools",
    description:
      "Build collections and NFT metadata, and store the files on Shelby with the same wallet.",
  },
  {
    number: "06",
    title: "Developer tools",
    description:
      "An API playground, SDK examples and a code generator, plus an Explorer to look up any wallet's files.",
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
            Everything a creator needs, on Shelby.
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
            From the first upload to a live audience, Shelby Studio
            keeps your content, your links and your streams in
            one place.
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
