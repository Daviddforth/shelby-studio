"use client";

import {
  Boxes,
  CheckCircle2,
  Database,
  FolderKanban,
  HardDrive,
  Image,
  Layers3,
} from "lucide-react";

import type { Project } from "@/context/project/types";

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({
  project,
}: ProjectOverviewProps) {
  const completion =
    Math.round(
      (
        Object.values(project.progress).filter(Boolean)
          .length /
        Object.keys(project.progress).length
      ) *
        100
    );

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              <FolderKanban size={14} />
              Project Overview
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white">
              {project.name}
            </h1>

            <p className="mt-3 max-w-3xl text-slate-400">
              {project.description ||
                "No project description has been added yet."}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-5 text-center">
            <p className="text-xs uppercase tracking-wider text-emerald-400">
              Status
            </p>

            <p className="mt-2 text-xl font-bold text-white capitalize">
              {project.status}
            </p>
          </div>

        </div>
      </div>

      <div className="grid gap-5 p-8 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={<Image size={22} />}
          label="Assets"
          value={project.assetCount}
        />

        <StatCard
          icon={<Database size={22} />}
          label="Metadata"
          value={project.metadataCount}
        />

        <StatCard
          icon={<Layers3 size={22} />}
          label="Collections"
          value={project.collectionCount}
        />

        <StatCard
          icon={<HardDrive size={22} />}
          label="Storage"
          value={`${(
            project.storageUsed /
            1024 /
            1024
          ).toFixed(2)} MB`}
        />

      </div>

      <div className="border-t border-slate-800 p-8">

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Project Progress
          </h2>

          <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            {completion}%
          </span>
        </div>

        <div className="mb-8 h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${completion}%`,
            }}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">

          <ProgressItem
            label="Wallet"
            complete={project.progress.wallet}
          />

          <ProgressItem
            label="Storage"
            complete={project.progress.storage}
          />

          <ProgressItem
            label="Assets"
            complete={project.progress.assets}
          />

          <ProgressItem
            label="Metadata"
            complete={project.progress.metadata}
          />

          <ProgressItem
            label="Collection"
            complete={project.progress.collection}
          />

          <ProgressItem
            label="Published"
            complete={project.progress.published}
          />

        </div>
      </div>

      <div className="border-t border-slate-800 p-8">

        <div className="mb-5 flex items-center gap-2">
          <Boxes
            size={20}
            className="text-blue-400"
          />

          <h2 className="text-xl font-semibold text-white">
            Shelby Assets
          </h2>
        </div>

        {project.projectAssets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
            <p className="text-slate-400">
              No Shelby assets uploaded yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {project.projectAssets.map(
              (asset) => (
                <div
                  key={asset.uid}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div>
                    <p className="font-medium text-white">
                      {asset.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {asset.blobName ??
                        "Pending"}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                    Stored
                  </span>
                </div>
              )
            )}
          </div>
        )}

      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <div className="text-blue-400">
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function ProgressItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
      <span className="text-slate-300">
        {label}
      </span>

      {complete ? (
        <CheckCircle2
          className="text-emerald-400"
          size={18}
        />
      ) : (
        <span className="text-sm text-slate-500">
          Pending
        </span>
      )}
    </div>
  );
}
