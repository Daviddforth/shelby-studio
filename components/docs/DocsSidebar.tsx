import Link from "next/link";

const sections = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Introduction",
        slug: "introduction",
      },
      {
        title: "Philosophy",
        slug: "philosophy",
      },
      {
        title: "Architecture",
        slug: "architecture",
      },
    ],
  },
  {
    title: "Core Platform",
    items: [
      {
        title: "Storage Engine",
        slug: "storage-engine",
      },
      {
        title: "Upload Pipeline",
        slug: "upload-pipeline",
      },
      {
        title: "Explorer",
        slug: "explorer",
      },
    ],
  },
  {
    title: "NFT Tools",
    items: [
      {
        title: "Metadata",
        slug: "metadata",
      },
      {
        title: "Collections",
        slug: "collections",
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        title: "Dashboard",
        slug: "dashboard",
      },
      {
        title: "Engineering Decisions",
        slug: "engineering-decisions",
      },
    ],
  },
];

export default function DocsSidebar() {
  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950/80 p-6 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <Link
        href="/docs"
        className="text-xl font-bold text-white"
      >
        Shelby Studio
      </Link>

      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-400">
        Documentation
      </p>

      <nav className="mt-8 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
