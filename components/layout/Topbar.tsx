"use client";

import Link from "next/link";

import {
  Bell,
  Moon,
  Search,
  UserCircle2,
} from "lucide-react";

import ConnectWallet from "../wallet/ConnectWallet";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-8">

        {/* Search */}

        <div className="relative w-full max-w-lg">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            placeholder="Search NFTs, collections or storage..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
          />

        </div>

        {/* Right Side */}

        <div className="ml-8 flex items-center gap-4">

          {/* Notifications */}

          <button className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition hover:border-blue-500">
            <Bell
              size={18}
              className="text-slate-300"
            />
          </button>

          {/* Theme */}

          <button className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition hover:border-blue-500">
            <Moon
              size={18}
              className="text-slate-300"
            />
          </button>

          {/* Wallet */}

          <ConnectWallet />

          {/* Profile */}

          <Link
            href="/profile"
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 transition hover:border-blue-500"
          >
            <UserCircle2
              size={34}
              className="text-slate-300"
            />
          </Link>

        </div>

      </div>
    </header>
  );
}