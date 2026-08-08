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
    <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Filter
              size={17}
              className="text-blue-400"
            />

            <h2 className="font-semibold text-white">
              Explorer Filters
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-400">
            Filter projects by publication state and sort
            the workspace to find what you need.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-wider text-slate-500">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="min-w-44 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            >
              <option value="all">
                All Projects
              </option>

              <option value="published">
                Published
              </option>

              <option value="complete">
                Publication Complete
              </option>

              <option value="in-progress">
                In Progress
              </option>
            </select>
          </div>

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
                Most Assets
              </option>

              <option value="smallest">
                Fewest Assets
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
