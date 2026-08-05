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
      description: "Digital assets",
      icon: Boxes,
    },
    {
      label: "Metadata",
      value: project.metadataCount.toLocaleString(),
      description: "Metadata files",
      icon: FileJson,
    },
    {
      label: "Collections",
      value: project.collectionCount.toLocaleString(),
      description: "NFT collections",
      icon: FolderKanban,
    },
    {
      label: "Storage",
      value: formatStorage(project.storageUsed),
      description: "Storage used",
      icon: Database,
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Project Overview
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          A quick overview of your project resources.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon
                    size={20}
                    className="text-blue-400"
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {stat.description}
              </p>
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