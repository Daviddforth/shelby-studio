"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Database,
} from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";

export default function ActiveProjectBanner() {
  const { activeProject } = useProject();

  if (!activeProject) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
        <p className="font-medium text-amber-300">
          No active project
        </p>

        <p className="mt-1 text-sm text-amber-200/70">
          Select a project before uploading
          project-specific assets.
        </p>

        <Link
          href="/projects"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200"
        >
          <ArrowLeft size={16} />
          Choose a Project
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <Database
              size={21}
              className="text-blue-400"
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
              Working in
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-white">
                {activeProject.name}
              </h2>

              <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs capitalize text-slate-300">
                {activeProject.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Assets uploaded here belong to this project.
            </p>
          </div>
        </div>

        <Link
          href={`/projects/${activeProject.id}`}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Link>
      </div>
    </div>
  );
}