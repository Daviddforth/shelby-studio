"use client";

import Link from "next/link";
import {
  UploadCloud,
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
    icon: UploadCloud,
    iconClass: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "Create Collection",
    description: "Organize your assets",
    href: "/collections",
    icon: FolderPlus,
    iconClass: "bg-violet-500/15 text-violet-400",
  },
  {
    title: "Generate Metadata",
    description: "Create NFT metadata",
    href: "/metadata",
    icon: FileJson,
    iconClass: "bg-emerald-500/15 text-emerald-400",
  },
  {
    title: "Asset Explorer",
    description: "Browse stored assets",
    href: "/explorer",
    icon: Search,
    iconClass: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "Documentation",
    description: "Developer guides",
    href: "/docs",
    icon: BookOpen,
    iconClass: "bg-amber-500/15 text-amber-400",
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconClass}`}
              >
                <Icon size={19} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
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
