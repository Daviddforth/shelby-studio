"use client";

import {
  FolderPlus,
  Plus,
} from "lucide-react";

interface EmptyProjectsProps {
  onCreateProject: () => void;
}

export default function EmptyProjects({
  onCreateProject,
}: EmptyProjectsProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
        <FolderPlus
          size={30}
          className="text-blue-400"
        />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-white">
        No projects yet
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
        Create your first project to organize assets,
        metadata, collections, storage, and publishing
        in one workspace.
      </p>

      <button
        type="button"
        onClick={onCreateProject}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
      >
        <Plus size={18} />

        Create your first project
      </button>
    </div>
  );
}