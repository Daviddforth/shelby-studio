"use client";

import { Grid2X2, List, Search } from "lucide-react";

export default function PortfolioFilters() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search NFTs or Collections..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl bg-blue-600 p-3 text-white">
            <Grid2X2 size={20} />
          </button>

          <button className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-300 hover:border-blue-500">
            <List size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}