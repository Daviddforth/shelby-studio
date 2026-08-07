"use client";

import { Clock3 } from "lucide-react";

import type { ProjectView } from "@/lib/project/projectView";

interface Props {
  project: ProjectView;
}

export default function PublicationTimeline({
  project,
}: Props) {
  const steps = [
    project.publicationStatus.manifest,
    project.publicationStatus.registered,
    project.publicationStatus.uploaded,
    project.publicationStatus.committed,
    project.publicationStatus.published,
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Publication Timeline
      </h2>

      <div className="mt-8 space-y-6">
        {steps.map((stage) => (
          <div
            key={stage.label}
            className="flex items-start gap-4"
          >
            <div className="mt-1">
              <Clock3
                size={18}
                className={
                  stage.completed
                    ? "text-emerald-400"
                    : "text-slate-500"
                }
              />
            </div>

            <div>
              <p className="font-semibold text-white">
                {stage.label}
              </p>

              <p className="text-sm text-slate-500">
                {stage.completed
                  ? "Completed"
                  : "Waiting"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
