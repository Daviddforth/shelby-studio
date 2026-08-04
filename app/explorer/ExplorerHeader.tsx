"use client";

import { Search } from "lucide-react";

export default function ExplorerHeader() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-blue-600 p-4">
          <Search size={28} className="text-white" />
        </div>

        <div>
          <p className="uppercase tracking-widest text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-1 text-4xl font-bold text-white">
            Asset Explorer
          </h1>

          <p className="mt-2 text-slate-400">
            Browse, search and manage every file stored on
            Shelbynet from one workspace.
          </p>
        </div>
      </div>
    </div>
  );
}