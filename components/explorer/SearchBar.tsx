"use client";

import { Search } from "lucide-react";
import { useStorageContext } from "@/context/StorageContext";

export default function SearchBar() {
  const {
    search,
    setSearch,
  } = useStorageContext();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          size={20}
        />

        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-500"
        />
      </div>
    </div>
  );
}