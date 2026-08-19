import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Code2,
  Database,
  FileJson,
  Layers3,
  LayoutDashboard,
  Network,
  Search,
  Settings2,
} from "lucide-react";

const cards = [
  {
    title: "Introduction",
    description:
      "Learn what Shelby Studio is and what the platform is designed to accomplish.",
    href: "/docs/introduction",
    icon: BookOpen,
  },
  {
    title: "Philosophy",
    description:
      "Understand the principles that guide the design and development of Shelby Studio.",
    href: "/docs/philosophy",
    icon: Layers3,
  },
  {
    title: "Architecture",
    description:
      "Understand the architecture and major systems that power Shelby Studio.",
    href: "/docs/architecture",
    icon: Network,
  },
  {
    title: "Storage Engine",
    description:
      "Explore Shelby storage integration, asset lifecycle, uploads and downloads.",
    href: "/docs/storage-engine",
    icon: Database,
  },
  {
    title: "Upload Pipeline",
    description:
      "Follow the upload workflow from the browser through Shelby storage and on-chain commit.",
    href: "/docs/upload-pipeline",
    icon: Boxes,
  },
  {
    title: "Explorer",
    description:
      "Learn how assets are searched, filtered, sorted and explored.",
    href: "/docs/explorer",
    icon: Search,
  },
  {
    title: "Metadata",
    description:
      "Learn how Shelby Studio creates and manages NFT metadata.",
    href: "/docs/metadata",
    icon: FileJson,
  },
  {
    title: "Collections",
    description:
      "Learn how collection tooling fits into the Shelby Studio workflow.",
    href: "/docs/collections",
    icon: Layers3,
  },
  {
    title: "Dashboard",
    description:
      "Understand the central workspace experience and how platform information is presented.",
    href: "/docs/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Engineering Decisions",
    description:
      "Explore the technical decisions and boundaries behind the Shelby Studio implementation.",
    href: "/docs/engineering-decisions",
    icon: Settings2,
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          Shelby Studio
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Documentation
        </h1>

        <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
          Technical documentation, architecture notes,
          storage workflows and guides for building
          with Shelby Studio.
        </p>
      </div>

      <div className="mt-10 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
        <BookOpen
          size={17}
          className="shrink-0 text-blue-400"
        />

        <p className="text-sm text-slate-400">
          Explore the documentation using the sections
          below or navigate from the sidebar.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-blue-500/40 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <Icon
                    size={17}
                    className="text-blue-400"
                  />
                </div>

                <ArrowRight
                  size={16}
                  className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-blue-400"
                />
              </div>

              <h2 className="mt-5 text-base font-semibold text-white transition group-hover:text-blue-400">
                {card.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>

              <p className="mt-4 text-xs font-medium text-blue-400">
                Read documentation
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
