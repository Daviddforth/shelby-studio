"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Database,
} from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";

export default function ActiveProjectBanner() {
  const {
    projects,
    activeProject,
    selectProject,
  } = useProject();

  const [open, setOpen] = useState(false);

  if (!activeProject) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-amber-300">
            No active project
          </p>

          <p className="mt-0.5 text-xs text-amber-200/60">
            Select a project before uploading project-specific assets.
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

  function handleSelectProject(projectId: string) {
    selectProject(projectId);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <Database size={17} className="text-blue-400" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Working in
          </p>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="flex max-w-full items-center gap-2 rounded-md py-0.5 text-left transition hover:text-blue-400"
              aria-expanded={open}
            >
              <span className="truncate text-sm font-semibold text-white">
                {activeProject.name}
              </span>

              <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] capitalize text-slate-400">
                {activeProject.status}
              </span>

              <ChevronDown
                size={14}
                className={`shrink-0 text-slate-500 transition ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Switch project
                </p>

                {projects.map((project) => {
                  const selected =
                    project.id === activeProject.id;

                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() =>
                        handleSelectProject(project.id)
                      }
                      className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-800"
                    >
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-medium ${
                            selected
                              ? "text-blue-400"
                              : "text-slate-200"
                          }`}
                        >
                          {project.name}
                        </p>

                        {project.description && (
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {selected && (
                        <Check
                          size={15}
                          className="shrink-0 text-blue-400"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Assets uploaded here belong to this project.
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
