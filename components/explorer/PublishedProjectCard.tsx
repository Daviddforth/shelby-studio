"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Database,
  ExternalLink,
  FolderKanban,
  HardDrive,
  UploadCloud,
} from "lucide-react";

import type { ProjectView } from "@/lib/project/projectView";

interface PublishedProjectCardProps {
  project: ProjectView;
}

export default function PublishedProjectCard({
  project,
}: PublishedProjectCardProps) {
  const isComplete =
    project.publicationComplete;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500/40 hover:bg-slate-900/90">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
          <FolderKanban
            size={19}
            className="text-blue-400"
          />
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            isComplete
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/20 bg-amber-500/10 text-amber-400"
          }`}
        >
          {isComplete ? (
            <CheckCircle2 size={12} />
          ) : (
            <UploadCloud size={12} />
          )}

          {isComplete ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-5">
        <h2 className="truncate text-lg font-semibold text-white">
          {project.title}
        </h2>

        <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {project.description ||
            "No project description has been added yet."}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Metric
          icon={<Database size={14} />}
          label="Assets"
          value={project.assetCount.toLocaleString()}
        />

        <Metric
          icon={<FolderKanban size={14} />}
          label="Collections"
          value={project.collectionCount.toLocaleString()}
        />

        <Metric
          icon={<HardDrive size={14} />}
          label="Storage"
          value={formatStorage(project.storageUsed)}
        />

        <Metric
          icon={<CalendarDays size={14} />}
          label="Published"
          value={project.publishedDate ?? "Pending"}
        />
      </div>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Network
            </p>

            <p className="mt-1 text-xs font-medium text-slate-300">
              {project.network ?? "Shelbynet"}
            </p>
          </div>

          {project.owner && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Owner
              </p>

              <p className="mt-1 font-mono text-[11px] text-slate-500">
                {shortenAddress(project.owner)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex gap-2.5 pt-5">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
        >
          View Project
          <ArrowUpRight size={14} />
        </Link>

        {project.explorerUrl && (
          <a
            href={project.explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2.5 text-xs font-medium text-slate-400 transition hover:border-blue-500 hover:text-white"
          >
            <ExternalLink size={14} />
            Explorer
          </a>
        )}
      </div>
    </article>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
      <div className="flex items-center gap-1.5 text-blue-400">
        {icon}

        <span className="text-[10px] uppercase tracking-wide text-slate-600">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-xs font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function shortenAddress(address: string) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
