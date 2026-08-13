"use client";

import {
  FolderKanban,
  Database,
  HardDrive,
} from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";
import { isProjectPublished } from "@/lib/project/publication";

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

export default function PortfolioStats() {
  const { projects } = useProject();

  const published = projects.filter(isProjectPublished);

  const totalAssets = published.reduce(
    (sum, project) => sum + project.assetCount,
    0
  );

  const storage = published.reduce(
    (sum, project) => sum + project.storageUsed,
    0
  );

  const stats = [
    {
      title: "Published Projects",
      value: published.length,
      icon: FolderKanban,
    },
    {
      title: "Published Assets",
      value: totalAssets,
      icon: Database,
    },
    {
      title: "Storage Used",
      value: formatBytes(storage),
      icon: HardDrive,
    },
  ];

  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="bg-slate-950 px-5 py-5"
          >
            <div className="flex items-center gap-2 text-slate-500">
              <Icon size={15} className="text-blue-400" />

              <span className="text-[11px] font-medium uppercase tracking-wider">
                {stat.title}
              </span>
            </div>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
