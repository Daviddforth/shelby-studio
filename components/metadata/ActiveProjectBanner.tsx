"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
} from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";

export default function ActiveProjectBanner() {
  const { activeProject } = useProject();

  if (!activeProject) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-amber-300">
            No active project
          </p>

          <p className="mt-0.5 text-xs text-amber-200/60">
            Select a project before creating project-specific metadata.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200"
        >
          <ArrowLeft size={15} />
          Choose Project
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <FolderKanban
            size={17}
            className="text-blue-400"
          />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Working in
          </p>

          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-white">
              {activeProject.name}
            </h2>

            <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] capitalize text-slate-400">
              {activeProject.status}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Metadata created here belongs to this project.
          </p>
        </div>
      </div>

      <Link
        href={`/projects/${activeProject.id}`}
        className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={14} />
        Back to Project
      </Link>
    </div>
  );
}
