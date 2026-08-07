"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Database,
  FolderKanban,
  ArrowRight,
} from "lucide-react";

import type { Project } from "@/context/project/types";
import {
  formatPublishDate,
  isPublicationComplete,
} from "@/lib/project/publication";

interface Props {
  project: Project;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function PublishedProjectCard({
  project,
}: Props) {
  const complete =
    isPublicationComplete(project);

  return (
    <Link
      href={`/portfolio/${project.id}`}
      className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500 hover:bg-slate-900/80"
    >
      <div className="flex items-start justify-between">
        <FolderKanban
          className="text-blue-400"
          size={32}
        />

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            complete
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-amber-500/15 text-amber-400"
          }`}
        >
          <CheckCircle2 size={14} />

          {complete
            ? "Published"
            : "Publishing"}
        </div>
      </div>

      <h2 className="mt-6 text-xl font-bold text-white">
        {project.name}
      </h2>

      <p className="mt-2 line-clamp-2 text-sm text-slate-400">
        {project.description ||
          "No description provided."}
      </p>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">
            Assets
          </span>

          <span className="text-white">
            {project.assetCount}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Storage
          </span>

          <span className="flex items-center gap-2 text-white">
            <Database size={15} />

            {formatBytes(project.storageUsed)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Published
          </span>

          <span className="text-white">
            {formatPublishDate(project) ??
              "—"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Network
          </span>

          <span className="text-blue-400">
            {project.publishRecord
              ?.network ?? "Shelbynet"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
        <span className="text-sm text-blue-400">
          View Details
        </span>

        <ArrowRight
          size={18}
          className="transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}