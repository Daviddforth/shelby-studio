"use client";

import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
} from "lucide-react";

import type { Project } from "@/context/project/types";

interface ProjectDashboardHeaderProps {
  project: Project;
}

export default function ProjectDashboardHeader({
  project,
}: ProjectDashboardHeaderProps) {
  const statusStyles = {
    draft:
      "border-slate-700 bg-slate-800 text-slate-300",

    ready:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",

    published:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div>
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      {/* Project */}
      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
            <FolderKanban
              size={27}
              className="text-blue-400"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {project.name}
              </h1>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                  statusStyles[project.status]
                }`}
              >
                {project.status}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {project.description ||
                "No project description yet."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Network
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-sm font-medium text-white">
              Shelbynet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}