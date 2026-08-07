"use client";

import {
  CheckCircle2,
  Circle,
} from "lucide-react";

import type { ProjectView } from "@/lib/project/projectView";

interface Props {
  project: ProjectView;
}

export default function PublicationStatusCard({
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
        Publication Status
      </h2>

      <p className="mt-2 text-slate-400">
        Current Shelby publication pipeline.
      </p>

      <div className="mt-8 space-y-5">
        {steps.map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-4"
          >
            {step.completed ? (
              <CheckCircle2
                className="text-emerald-400"
                size={24}
              />
            ) : (
              <Circle
                className="text-slate-500"
                size={24}
              />
            )}

            <div>
              <p className="font-medium text-white">
                {step.label}
              </p>

              <p className="text-sm text-slate-500">
                {step.completed
                  ? "Completed"
                  : "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
