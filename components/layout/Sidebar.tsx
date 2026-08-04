"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Images,
  Database,
  FileJson,
  FolderKanban,
  Search,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: Images,
  },
  {
    name: "Storage",
    href: "/storage",
    icon: Database,
  },
  {
    name: "Explorer",
    href: "/explorer",
    icon: Search,
  },
  {
    name: "Metadata",
    href: "/metadata",
    icon: FileJson,
  },
  {
    name: "Collections",
    href: "/collections",
    icon: FolderKanban,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 px-8 py-8">
        <h1 className="text-3xl font-bold text-white">
          Shelby Studio
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Digital Asset Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-5">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}