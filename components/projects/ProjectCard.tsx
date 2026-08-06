"use client";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Boxes,
  Database,
  FileJson,
  FolderKanban,
  Trash2,
} from "lucide-react";

import type { Project } from "@/context/project/types";
import { useProject } from "@/context/project/ProjectContext";
import ProjectProgress from "./ProjectProgress";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const router = useRouter();

  const {
    activeProject,
    selectProject,
    deleteProject,
  } = useProject();

  const isActive =
    activeProject?.id === project.id;

  function handleOpenProject() {
    // Make this the globally active project.
    selectProject(project.id);

    // Open the project's dedicated dashboard.
    router.push(`/projects/${project.id}`);
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    deleteProject(project.id);
  }

  const statusStyles = {
    draft:
      "bg-slate-700/50 text-slate-300 border-slate-700",

    ready:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",

    published:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const stats = [
    {
      label: "Assets",
      value: project.assetCount,
      icon: Boxes,
    },
    {
      label: "Metadata",
      value: project.metadataCount,
      icon: FileJson,
    },
    {
      label: "Collections",
      value: project.collectionCount,
      icon: FolderKanban,
    },
    {
      label: "Storage",
      value: formatStorage(project.storageUsed),
      icon: Database,
    },
  ];

  return (
    <article
      onClick={handleOpenProject}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenProject();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open project ${project.name}`}
      className={`group cursor-pointer rounded-3xl border bg-slate-900 p-6 transition ${
        isActive
          ? "border-blue-500/60 shadow-lg shadow-blue-500/5"
          : "border-slate-800 hover:border-blue-500/40 hover:bg-slate-900/90"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="truncate text-xl font-semibold text-white">
              {project.name}
            </h2>

            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
                statusStyles[project.status]
              }`}
            >
              {project.status}
            </span>

            {isActive && (
              <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                Active
              </span>
            )}
          </div>

          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">
            {project.description ||
              "No project description yet."}
          </p>
        </div>

      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex items-center gap-2 text-slate-500">
                <Icon size={15} />

                <span className="text-xs">
                  {stat.label}
                </span>
              </div>

              <p className="mt-2 font-semibold text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-6">
        <ProjectProgress
          progress={project.progress}
          compact
        />
      </div>

      {/* Updated */}
      <p className="mt-4 text-xs text-slate-500">
        Updated {formatProjectDate(project.updatedAt)}
      </p>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete();
          }}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 size={16} />

          Delete
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleOpenProject();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          {isActive
            ? "Open Active Project"
            : "Open Project"}

          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function formatStorage(bytes: number) {
  if (!bytes) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024)
    ),
    units.length - 1
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(
    value >= 10 || index === 0 ? 0 : 1
  )} ${units[index]}`;
}

function formatProjectDate(
  dateString: string
) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}