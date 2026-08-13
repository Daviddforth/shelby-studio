"use client";

import { Search } from "lucide-react";

import { useStorageContext } from "@/context/StorageContext";

export default function SearchBar() {
  const {
    search,
    setSearch,
  } = useStorageContext();

  return (
    <div className="relative">
      <Search
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
      />

      <input
        type="text"
        placeholder="Search assets..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
      />
    </div>
  );
}
