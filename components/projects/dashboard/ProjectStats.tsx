"use client";

import {
  Boxes,
  Database,
  FileJson,
  FolderKanban,
} from "lucide-react";

import type { Project } from "@/context/project/types";

interface ProjectStatsProps {
  project: Project;
}

export default function ProjectStats({
  project,
}: ProjectStatsProps) {
  const stats = [
    {
      label: "Assets",
      value: project.assetCount.toLocaleString(),
      icon: Boxes,
    },
    {
      label: "Metadata",
      value: project.metadataCount.toLocaleString(),
      icon: FileJson,
    },
    {
      label: "Collections",
      value: project.collectionCount.toLocaleString(),
      icon: FolderKanban,
    },
    {
      label: "Storage",
      value: formatStorage(project.storageUsed),
      icon: Database,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-800 xl:grid-cols-4 xl:divide-y-0">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-5 py-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <Icon
                  size={17}
                  className="text-blue-400"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
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
