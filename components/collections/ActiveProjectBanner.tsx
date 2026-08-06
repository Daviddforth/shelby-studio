"use client";

import Link from "next/link";

import {
  ArrowLeft,
  ChevronDown,
  FolderKanban,
} from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";

export default function ActiveProjectBanner() {
  const {
    projects,
    activeProject,
    activeProjectId,
    selectProject,
  } = useProject();

  /*
   * No projects exist for this wallet.
   */
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
        <p className="font-medium text-amber-300">
          No projects available
        </p>

        <p className="mt-1 text-sm text-amber-200/70">
          Create a project before configuring a
          project-specific collection.
        </p>

        <Link
          href="/projects"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-300 transition hover:text-amber-200"
        >
          <ArrowLeft size={16} />
          Go to Projects
        </Link>
      </div>
    );
  }

  /*
   * Projects exist, but none is currently
   * selected.
   *
   * Instead of sending the user away,
   * allow them to select one right here.
   */
  if (!activeProject) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-amber-300">
              Choose a project
            </p>

            <p className="mt-1 text-sm text-amber-200/70">
              Select which project this collection
              belongs to.
            </p>
          </div>

          <div className="relative">
            <select
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) {
                  selectProject(
                    event.target.value
                  );
                }
              }}
              className="min-w-[220px] appearance-none rounded-xl border border-amber-500/30 bg-slate-950 py-3 pl-4 pr-10 text-sm font-medium text-white outline-none transition focus:border-amber-400"
            >
              <option value="" disabled>
                Select project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <FolderKanban
              size={21}
              className="text-blue-400"
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
              Working in
            </p>

            {/*
             * Project switcher.
             *
             * The currently active project is
             * selected, but the user can switch
             * directly to another wallet project.
             */}
            <div className="relative mt-1 inline-block">
              <select
                value={
                  activeProjectId ?? ""
                }
                onChange={(event) =>
                  selectProject(
                    event.target.value
                  )
                }
                className="min-w-[180px] appearance-none rounded-lg border border-slate-700 bg-slate-950 py-2 pl-3 pr-9 font-semibold text-white outline-none transition hover:border-blue-500/50 focus:border-blue-500"
              >
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Collection settings here belong to
              this project.
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