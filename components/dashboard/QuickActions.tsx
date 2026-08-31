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
        <h2 className="text-base font-semibold text-white sm:text-lg">
          Quick Actions
        </h2>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
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
              className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 transition-all hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900"
            >
              <div
                className={`flex h-9 w-9 shrink-0 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${action.iconClass}`}
              >
                <Icon size={19} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white sm:text-sm">
                  {action.title}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-xs">
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
