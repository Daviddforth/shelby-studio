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
    color: "bg-blue-600",
  },
  {
    title: "Create Collection",
    description: "Organize your assets",
    href: "/collections",
    icon: FolderPlus,
    color: "bg-purple-600",
  },
  {
    title: "Generate Metadata",
    description: "Create NFT metadata",
    href: "/metadata",
    icon: FileJson,
    color: "bg-green-600",
  },
  {
    title: "Asset Explorer",
    description: "Browse stored assets",
    href: "/explorer",
    icon: Search,
    color: "bg-orange-600",
  },
  {
    title: "Documentation",
    description: "Developer guides",
    href: "/docs",
    icon: BookOpen,
    color: "bg-cyan-600",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">
          Quick Actions
        </h2>

        <p className="mt-2 text-slate-400">
          Jump straight into the tools you use most.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-blue-500"
            >
              <div
                className={`inline-flex rounded-xl p-3 ${action.color}`}
              >
                <Icon
                  size={24}
                  className="text-white"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
