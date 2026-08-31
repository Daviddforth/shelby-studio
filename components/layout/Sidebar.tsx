"use client";

import Image from "next/image";
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
  BookOpen,
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
    name: "Collections",
    href: "/collections",
    icon: FolderKanban,
  },
  {
    name: "Storage",
    href: "/storage",
    icon: Database,
  },
  {
    name: "Metadata",
    href: "/metadata",
    icon: FileJson,
  },
  {
    name: "Explorer",
    href: "/explorer",
    icon: Search,
  },
];

const developerNavigation = [
  {
    name: "Developer",
    href: "/developer",
    icon: Code2,
  },
  {
    name: "AI Tools",
    href: "/ai",
    icon: Bot,
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: BookOpen,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function renderItem(
    item:
      | (typeof navigation)[number]
      | (typeof developerNavigation)[number]
  ) {
    const Icon = item.icon;

    const active =
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
            : "text-slate-400 hover:bg-slate-900 hover:text-white"
        }`}
      >
        <Icon
          size={18}
          strokeWidth={active ? 2.2 : 1.8}
          className={
            active
              ? "text-white"
              : "text-slate-500 transition-colors group-hover:text-blue-400"
          }
        />

        <span>{item.name}</span>
      </Link>
    );
  }

  return (
    <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r border-slate-800 bg-[#020617] md:flex">
      {/* Shelby Studio Logo */}
      <div className="flex h-[76px] items-center border-b border-slate-800 px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <Image
            src="/branding/shelby-studio-logo.png"
            alt="Shelby Studio"
            width={38}
            height={38}
            priority
            className="h-10 w-10"
          />

          <div className="min-w-0">
            <p className="text-[16px] font-bold tracking-tight text-white">
              Shelby Studio
            </p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Digital Asset Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Workspace
        </p>

        <div className="space-y-1">
          {navigation.map(renderItem)}
        </div>

        <div className="my-6 border-t border-slate-800" />

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Developer
        </p>

        <div className="space-y-1">
          {developerNavigation.map(renderItem)}
        </div>
      </nav>

      {/* Profile */}
      <div className="border-t border-slate-800 p-3">
        <Link
          href="/profile"
          className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
            pathname === "/profile"
              ? "bg-blue-600/10 text-blue-400"
              : "text-slate-400 hover:bg-slate-900 hover:text-white"
          }`}
        >
          <UserCircle2
            size={20}
            className={
              pathname === "/profile"
                ? "text-blue-400"
                : "text-slate-500 group-hover:text-blue-400"
            }
          />

          <div>
            <p className="font-medium">My Profile</p>
            <p className="text-[11px] text-slate-600">
              Account & wallet
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
