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

  function handleSelectProject(projectId: string) {
    selectProject(projectId);
    setOpen(false);
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

            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-left transition hover:bg-slate-800"
                aria-expanded={open}
              >
                <span className="font-semibold text-white">
                  {activeProject.name}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs capitalize text-slate-300">
                  {activeProject.status}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="absolute left-0 top-full z-50 mt-2 min-w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                  <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-500">
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
                            size={16}
                            className="shrink-0 text-blue-400"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
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
