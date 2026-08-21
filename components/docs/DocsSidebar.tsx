"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
} from "lucide-react";

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
      {
        title: "Dashboard",
        slug: "dashboard",
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
    title: "Developer",
    items: [
      {
        title: "Developer Platform",
        slug: "developer",
      },
    ],
  },
  {
    title: "Engineering",
    items: [
      {
        title: "Engineering Decisions",
        slug: "engineering-decisions",
      },
    ],
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950/95 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="p-4 sm:p-5 lg:p-6">
        <Link
          href="/docs"
          className="group flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
            <BookOpen
              size={18}
              className="text-blue-400"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white transition group-hover:text-blue-400">
              Shelby Studio
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
              Documentation
            </p>
          </div>
        </Link>

        <nav className="mt-8 space-y-7">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                {section.title}
              </p>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname ===
                    `/docs/${item.slug}`;

                  return (
                    <Link
                      key={item.slug}
                      href={`/docs/${item.slug}`}
                      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-blue-500/10 font-medium text-blue-400"
                          : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <span>
                        {item.title}
                      </span>

                      <ChevronRight
                        size={14}
                        className={`transition ${
                          active
                            ? "text-blue-400"
                            : "text-transparent group-hover:text-slate-600"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-10 border-t border-slate-800 pt-5">
          <Link
            href="/"
            className="text-xs text-slate-600 transition hover:text-slate-300"
          >
            ← Back to Shelby Studio
          </Link>
        </div>
      </div>
    </aside>
  );
}
