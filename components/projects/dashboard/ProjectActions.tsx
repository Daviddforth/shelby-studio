"use client";

import Link from "next/link";

import {
  ArrowRight,
  Database,
  FileJson,
  FolderKanban,
  Upload,
} from "lucide-react";

const actions = [
  {
    title: "Upload Asset",
    description:
      "Upload images, video, audio, and other digital assets.",
    href: "/storage",
    icon: Upload,
  },
  {
    title: "Create Metadata",
    description:
      "Build and validate NFT metadata for this project.",
    href: "/metadata",
    icon: FileJson,
  },
  {
    title: "Create Collection",
    description:
      "Configure your collection information and branding.",
    href: "/collections",
    icon: FolderKanban,
  },
  {
    title: "Manage Storage",
    description:
      "View and manage assets stored for this project.",
    href: "/storage",
    icon: Database,
  },
];

export default function ProjectActions() {
  return (
    <section>
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Continue Building
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Choose what you want to work on next.
        </p>
      </div>

      {/* Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500/40 hover:bg-slate-900/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                    <Icon
                      size={21}
                      className="text-blue-400"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-semibold text-white">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={18}
                  className="mt-1 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}