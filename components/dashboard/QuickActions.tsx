"use client";

import Link from "next/link";

import {
  Upload,
  FolderPlus,
  FileJson,
  Search,
  BookOpen,
} from "lucide-react";

const actions = [
  {
    title: "Upload Asset",
    description: "Store files on Shelby",
    href: "/storage",
    icon: Upload,
  },
  {
    title: "Create Collection",
    description: "Organize your assets",
    href: "/collections",
    icon: FolderPlus,
  },
  {
    title: "Generate Metadata",
    description: "Create NFT metadata",
    href: "/metadata",
    icon: FileJson,
  },
  {
    title: "Asset Explorer",
    description: "Browse stored assets",
    href: "/explorer",
    icon: Search,
  },
  {
    title: "Documentation",
    description: "Developer guides",
    href: "/docs",
    icon: BookOpen,
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Jump into the tools you use most.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 transition hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition group-hover:text-blue-400">
                <Icon size={16} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {action.title}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
