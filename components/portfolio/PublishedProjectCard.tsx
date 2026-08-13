"use client";

import Link from "next/link";

import {
  CheckCircle2,
  Database,
  FolderKanban,
  ArrowUpRight,
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
  const complete = isPublicationComplete(project);

  return (
    <Link
      href={`/portfolio/${project.id}`}
      className="group block rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-blue-500/40 hover:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
          <FolderKanban size={17} className="text-blue-400" />
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
            complete
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/20 bg-amber-500/10 text-amber-400"
          }`}
        >
          <CheckCircle2 size={12} />
          {complete ? "Published" : "Publishing"}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="truncate text-lg font-semibold text-white">
            {project.name}
          </h2>

          <ArrowUpRight
            size={17}
            className="shrink-0 text-slate-600 transition group-hover:text-blue-400"
          />
        </div>

        <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {project.description || "No description provided."}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Assets
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-200">
            {project.assetCount}
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Storage
          </p>

          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
            <Database size={13} className="text-slate-500" />
            {formatBytes(project.storageUsed)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Published
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatPublishDate(project) ?? "—"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Network
          </p>

          <p className="mt-1 text-xs text-blue-400">
            {project.publishRecord?.network ?? "Shelbynet"}
          </p>
        </div>
      </div>
    </Link>
  );
}
