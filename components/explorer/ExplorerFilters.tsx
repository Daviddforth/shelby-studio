"use client";

import {
  ArrowUpDown,
  Filter,
} from "lucide-react";

interface ExplorerFiltersProps {
  status: string;
  setStatus: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}

export default function ExplorerFilters({
  status,
  setStatus,
  sort,
  setSort,
}: ExplorerFiltersProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
          <Filter
            size={16}
            className="text-blue-400"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            Filter projects
          </p>

          <p className="text-xs text-slate-500">
            Refine by publication status or sort order.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <label
            htmlFor="explorer-status"
            className="hidden text-xs text-slate-500 sm:block"
          >
            Status
          </label>

          <select
            id="explorer-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-blue-500"
          >
            <option value="all">All Projects</option>
            <option value="published">Published</option>
            <option value="complete">Publication Complete</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown
            size={14}
            className="hidden text-slate-500 sm:block"
          />

          <label
            htmlFor="explorer-sort"
            className="hidden text-xs text-slate-500 sm:block"
          >
            Sort
          </label>

          <select
            id="explorer-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">Name A-Z</option>
            <option value="largest">Most Assets</option>
            <option value="smallest">Fewest Assets</option>
          </select>
        </div>
      </div>
    </div>
  );
}
