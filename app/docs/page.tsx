import Link from "next/link";

const cards = [
  {
    title: "Introduction",
    description:
      "Learn what Shelby Studio is and what the platform is designed to accomplish.",
    href: "/docs/introduction",
  },
  {
    title: "Architecture",
    description:
      "Understand the architecture and major systems that power Shelby Studio.",
    href: "/docs/architecture",
  },
  {
    title: "Storage Engine",
    description:
      "Explore Shelby storage integration, asset lifecycle, uploads and downloads.",
    href: "/docs/storage-engine",
  },
  {
    title: "Upload Pipeline",
    description:
      "Follow the upload workflow from the browser through Shelby storage and on-chain commit.",
    href: "/docs/upload-pipeline",
  },
  {
    title: "Metadata",
    description:
      "Learn how Shelby Studio creates and manages NFT metadata.",
    href: "/docs/metadata",
  },
  {
    title: "Collections",
    description:
      "Learn how collection tooling fits into the Shelby Studio workflow.",
    href: "/docs/collections",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 lg:px-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
        Shelby Studio
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
        Documentation
      </h1>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
        Technical documentation, architecture notes,
        storage workflows and guides for building
        with Shelby Studio.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/50 hover:bg-slate-900/80"
          >
            <h2 className="text-xl font-semibold text-white transition group-hover:text-blue-400">
              {card.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              {card.description}
            </p>

            <p className="mt-5 text-sm font-semibold text-blue-400">
              Read documentation →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
