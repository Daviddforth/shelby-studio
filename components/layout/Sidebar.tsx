"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserCircle2 } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

import { navSections, type NavItem } from "./navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const { walletConnected, walletAddress } = useWallet();

  function renderItem(item: NavItem) {
    const Icon = item.icon;

    const href =
      item.isMyPage && walletConnected && walletAddress
        ? `/c/${walletAddress}`
        : item.href;

    const active = item.isMyPage
      ? pathname.startsWith("/c/")
      : pathname === href || pathname.startsWith(`${href}/`);

    return (
      <Link
        key={item.name}
        href={href}
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
              Creator Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navSections.map((section, index) => (
          <div key={section.title}>
            {index > 0 && <div className="my-5 border-t border-slate-800" />}

            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {section.title}
            </p>

            <div className="space-y-1">{section.items.map(renderItem)}</div>
          </div>
        ))}
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
