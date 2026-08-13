"use client";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
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
    selectProject(project.id);
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
      "bg-slate-800 text-slate-300 border-slate-700",

    ready:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",

    published:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <article
      onClick={handleOpenProject}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          handleOpenProject();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open project ${project.name}`}
      className={`group cursor-pointer rounded-2xl border bg-slate-900 p-5 transition ${
        isActive
          ? "border-blue-500/50 shadow-lg shadow-blue-500/5"
          : "border-slate-800 hover:border-blue-500/30 hover:bg-slate-900/90"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold text-white">
              {project.name}
            </h2>

            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${
                statusStyles[project.status]
              }`}
            >
              {project.status}
            </span>

            {isActive && (
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                Active
              </span>
            )}
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-400">
            {project.description ||
              "No project description yet."}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        <span>
          <strong className="font-semibold text-slate-300">
            {project.assetCount}
          </strong>{" "}
          {project.assetCount === 1
            ? "Asset"
            : "Assets"}
        </span>

        <span className="text-slate-700">•</span>

        <span>
          <strong className="font-semibold text-slate-300">
            {project.metadataCount}
          </strong>{" "}
          Metadata
        </span>

        <span className="text-slate-700">•</span>

        <span>
          <strong className="font-semibold text-slate-300">
            {project.collectionCount}
          </strong>{" "}
          {project.collectionCount === 1
            ? "Collection"
            : "Collections"}
        </span>

        <span className="text-slate-700">•</span>

        <span>
          <strong className="font-semibold text-slate-300">
            {formatStorage(project.storageUsed)}
          </strong>
        </span>
      </div>

      <div className="mt-5 border-t border-slate-800 pt-4">
        <ProjectProgress
          progress={project.progress}
          compact
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-xs text-slate-600">
            Updated {formatProjectDate(project.updatedAt)}
          </p>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleDelete();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleOpenProject();
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
        >
          Open
          <ArrowRight size={14} />
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
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(
    value >= 10 || index === 0 ? 0 : 1
  )} ${units[index]}`;
}

function formatProjectDate(dateString: string) {
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
