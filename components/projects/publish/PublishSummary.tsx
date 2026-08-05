"use client";

import {
  Boxes,
  Database,
  FileJson,
  FolderKanban,
} from "lucide-react";

import type { Project } from "@/context/project/types";

interface PublishSummaryProps {
  project: Project;
}

export default function PublishSummary({
  project,
}: PublishSummaryProps) {
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
    <div>
      <h3 className="text-sm font-semibold text-white">
        Project Summary
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
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
    </div>
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