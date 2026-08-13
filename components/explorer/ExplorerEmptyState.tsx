"use client";

import {
  FolderSearch,
  SearchX,
} from "lucide-react";

interface ExplorerEmptyStateProps {
  search?: string;
  filtered?: boolean;
}

export default function ExplorerEmptyState({
  search = "",
  filtered = false,
}: ExplorerEmptyStateProps) {
  const hasSearch = search.trim().length > 0;
  const noResults = hasSearch || filtered;

  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-14 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/70">
        {noResults ? (
          <SearchX
            size={19}
            className="text-slate-500"
          />
        ) : (
          <FolderSearch
            size={19}
            className="text-blue-400"
          />
        )}
      </div>

      <h2 className="mt-4 text-base font-semibold text-white">
        {noResults
          ? "No projects found"
          : "No projects yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {noResults
          ? "No projects match your current search or filter. Try adjusting your search or status."
          : "Create your first project to begin building your Shelby Studio workspace."}
      </p>
    </div>
  );
}
