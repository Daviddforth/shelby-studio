"use client";

import {
  FolderKanban,
  Database,
  CheckCircle2,
  HardDrive,
} from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";
import {
  isProjectPublished,
  isPublicationComplete,
} from "@/lib/project/publication";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

export default function PortfolioStats() {
  const { projects } = useProject();

  const published =
    projects.filter(isProjectPublished);

  const totalAssets =
    published.reduce(
      (sum, project) => sum + project.assetCount,
      0
    );

  const storage =
    published.reduce(
      (sum, project) => sum + project.storageUsed,
      0
    );

  const completed =
    published.filter(isPublicationComplete)
      .length;

  const completion =
    published.length === 0
      ? "0%"
      : `${Math.round(
          (completed / published.length) *
            100
        )}%`;

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
    {
      title: "Publication Complete",
      value: completion,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between">
              <Icon
                className="text-blue-400"
                size={28}
              />

              <span className="text-3xl font-bold text-white">
                {stat.value}
              </span>
            </div>

            <p className="mt-5 text-slate-400">
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}