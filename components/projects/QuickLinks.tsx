"use client";

import Link from "next/link";

import {
  Database,
  FileJson,
  FolderKanban,
  HardDrive,
  Images,
  Search,
} from "lucide-react";

const links = [
  {
    title: "Storage",
    href: "/storage",
    icon: HardDrive,
  },
  {
    title: "Metadata",
    href: "/metadata",
    icon: FileJson,
  },
  {
    title: "Collections",
    href: "/collections",
    icon: FolderKanban,
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: Images,
  },
  {
    title: "Explorer",
    href: "/explorer",
    icon: Search,
  },
  {
    title: "Developer",
    href: "/developer",
    icon: Database,
  },
];

export default function QuickLinks() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-xl font-semibold text-white">
        Quick Links
      </h2>

      <p className="mt-2 text-slate-400">
        Jump to another Shelby Studio workspace.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.title}
              href={link.href}
              className="flex items-center gap-4 rounded-2xl border border-slate-800 p-4 transition hover:border-blue-500"
            >
              <Icon
                size={20}
                className="text-blue-400"
              />

              <span className="font-medium text-white">
                {link.title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}