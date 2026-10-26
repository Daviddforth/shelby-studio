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
  Radio,
  Search,
  Settings2,
  Video,
  Globe,
} from "lucide-react";

const cards = [
  {
    title: "Introduction",
    description:
      "What Shelby Studio is, what you can do with it, and how the pieces fit together.",
    href: "/docs/introduction",
    icon: BookOpen,
  },
  {
    title: "Quick Start",
    description:
      "Go from a new wallet to a hosted video, a share link and a live stream.",
    href: "/docs/quick-start",
    icon: Code2,
  },
  {
    title: "Philosophy",
    description:
      "The principles behind how Shelby Studio is designed.",
    href: "/docs/philosophy",
    icon: Layers3,
  },
  {
    title: "Architecture",
    description:
      "The systems that power Shelby Studio: Shelby, Postgres, LiveKit and the wallet.",
    href: "/docs/architecture",
    icon: Network,
  },
  {
    title: "Library",
    description:
      "Upload video, audio and images, add details, and copy share links and embed codes.",
    href: "/docs/library",
    icon: Video,
  },
  {
    title: "Go Live",
    description:
      "Stream from your browser, share one link, and chat with viewers.",
    href: "/docs/live-streaming",
    icon: Radio,
  },
  {
    title: "Public Pages & Embeds",
    description:
      "Public media pages, creator pages, embed codes and how files are served.",
    href: "/docs/public-pages-embeds",
    icon: Globe,
  },
  {
    title: "Tips, Follows and Views",
    description:
      "Get tipped in APT, build followers and see your audience, with no platform fee.",
    href: "/docs/tips-follows-views",
    icon: Globe,
  },
  {
    title: "Collections, Comments and Scheduled Lives",
    description:
      "Playlists, wallet-signed comments, scheduled streams and watch time.",
    href: "/docs/collections-comments",
    icon: Globe,
  },
  {
    title: "Paid Files",
    description:
      "Sell locked files for APT, paid straight to your wallet. How it works and who you must trust.",
    href: "/docs/paid-files",
    icon: Globe,
  },
  {
    title: "Storage Engine",
    description:
      "Shelby storage integration, asset lifecycle and wallet-signed transactions.",
    href: "/docs/storage-engine",
    icon: Database,
  },
  {
    title: "Upload Pipeline",
    description:
      "How uploads work: preparation, parallel pieces, retries and finalizing.",
    href: "/docs/upload-pipeline",
    icon: Layers3,
  },
  {
    title: "Explorer",
    description:
      "Look up the files stored by any wallet address.",
    href: "/docs/explorer",
    icon: Search,
  },
  {
    title: "Dashboard",
    description:
      "The Home page, the menu and where the numbers come from.",
    href: "/docs/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Developer Platform",
    description:
      "The API Playground, read-only Shelby routes, SDK examples and code generation.",
    href: "/docs/developer",
    icon: Code2,
  },
  {
    title: "Self-Hosting Setup",
    description:
      "Run your own copy: environment variables, database, LiveKit and deployment.",
    href: "/docs/self-hosting",
    icon: Settings2,
  },
  {
    title: "Engineering Decisions",
    description:
      "Why Shelby Studio is built the way it is, including security choices.",
    href: "/docs/engineering-decisions",
    icon: Settings2,
  },
  {
    title: "Limitations & Roadmap",
    description:
      "What works today, what does not, and what is planned.",
    href: "/docs/limitations-roadmap",
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
