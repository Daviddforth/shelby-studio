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
  Code2,
  Boxes,
  Bot,
  UserCircle2,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Assets",
    href: "/assets",
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

const developerNavigation = [
  {
    name: "Developer",
    href: "/developer",
    icon: Code2,
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: Boxes,
  },
  {
    name: "AI",
    href: "/ai",
    icon: Bot,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function renderItem(item: (typeof navigation)[number]) {
    const Icon = item.icon;

    const active =
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
          active
            ? "bg-blue-500/10 text-blue-400"
            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
        }`}
      >
        <Icon
          size={18}
          strokeWidth={active ? 2.2 : 1.8}
          className={
            active
              ? "text-blue-400"
              : "text-slate-500 group-hover:text-slate-300"
          }
        />

        <span>{item.name}</span>
      </Link>
    );
  }

  return (
    <aside className="flex h-screen w-[248px] shrink-0 flex-col border-r border-slate-800 bg-[#020617]">
      {/* Brand */}
      <div className="flex h-[76px] items-center border-b border-slate-800 px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
            S
          </div>

          <div>
            <p className="text-[15px] font-bold tracking-tight text-white">
              Shelby Studio
            </p>

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Digital Asset Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map(renderItem)}
        </div>

        <div className="my-6 border-t border-slate-800" />

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Developer
        </p>

        <div className="space-y-1">
          {developerNavigation.map(renderItem)}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
        >
          <UserCircle2 size={18} className="text-slate-500" />
          <span>My Profile</span>
        </Link>
      </div>
    </aside>
  );
}
