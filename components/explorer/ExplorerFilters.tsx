"use client";

import {
  Filter,
  ArrowUpDown,
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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <Filter
              size={18}
              className="text-blue-400"
            />
            Filters
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Filter and sort assets in your current workspace.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-slate-500">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="min-w-40 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            >
              <option value="all">
                All Assets
              </option>

              <option value="Stored">
                Stored
              </option>

              <option value="Failed">
                Failed
              </option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
              <ArrowUpDown size={13} />
              Sort
            </label>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="min-w-44 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            >
              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="name">
                Name A-Z
              </option>

              <option value="largest">
                Largest
              </option>

              <option value="smallest">
                Smallest
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
