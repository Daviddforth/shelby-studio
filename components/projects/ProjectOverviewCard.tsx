"use client";

import {
  Calendar,
  FolderKanban,
  HardDrive,
  Layers3,
} from "lucide-react";

import type { ProjectView } from "@/lib/project/projectView";

interface Props {
  project: ProjectView;
}

export default function ProjectOverviewCard({
  project,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            Project
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            {project.title}
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            {project.description ||
              "No description provided."}
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            project.publicationComplete
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          {project.publicationComplete
            ? "Publication Complete"
            : "Draft"}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-4">
        <Stat
          icon={FolderKanban}
          label="Assets"
          value={project.assetCount.toString()}
        />

        <Stat
          icon={Layers3}
          label="Collections"
          value={project.collectionCount.toString()}
        />

        <Stat
          icon={HardDrive}
          label="Storage"
          value={formatBytes(
            project.storageUsed
          )}
        />

        <Stat
          icon={Calendar}
          label="Published"
          value={
            project.publishedDate ??
            "Not Published"
          }
        />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;

  label: string;

  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <Icon
        className="text-blue-400"
        size={24}
      />

      <p className="mt-5 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function formatBytes(bytes: number) {
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
      Math.log(bytes) /
        Math.log(1024)
    ),
    units.length - 1
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}