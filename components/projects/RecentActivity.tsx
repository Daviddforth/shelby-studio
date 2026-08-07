"use client";

import {
  CheckCircle2,
  Clock3,
} from "lucide-react";

import type { ProjectView } from "@/lib/project/projectView";

interface Props {
  project: ProjectView;
}

export default function RecentActivity({
  project,
}: Props) {
  const activity = [
    {
      label: "Project Created",
      completed: true,
    },
    {
      label: "Assets Uploaded",
      completed: project.assetCount > 0,
    },
    {
      label: "Metadata Generated",
      completed: project.metadataCount > 0,
    },
    {
      label: "Collection Created",
      completed: project.collectionCount > 0,
    },
    {
      label: "Published",
      completed: project.published,
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-xl font-semibold text-white">
        Recent Activity
      </h2>

      <p className="mt-2 text-slate-400">
        Latest milestones for this project.
      </p>

      <div className="mt-8 space-y-4">
        {activity.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4"
          >
            {item.completed ? (
              <CheckCircle2
                size={20}
                className="text-emerald-400"
              />
            ) : (
              <Clock3
                size={20}
                className="text-slate-500"
              />
            )}

            <div>
              <p className="font-medium text-white">
                {item.label}
              </p>

              <p className="text-sm text-slate-500">
                {item.completed
                  ? "Completed"
                  : "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}