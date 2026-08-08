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

  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
        {hasSearch || filtered ? (
          <SearchX size={30} />
        ) : (
          <FolderSearch size={30} />
        )}
      </div>

      <h2 className="mt-6 text-xl font-semibold text-white">
        {hasSearch || filtered
          ? "No Projects Found"
          : "No Projects Yet"}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        {hasSearch || filtered
          ? "No projects match your current search or filter. Try adjusting your search or status."
          : "Create a project and begin building your Shelby Studio publication workflow."}
      </p>
    </div>
  );
}
