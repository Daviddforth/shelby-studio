"use client";

import { useState } from "react";

import {
  Check,
  Circle,
  Rocket,
} from "lucide-react";

import type { Project } from "@/context/project/types";

import PublishProjectModal from "@/components/projects/publish/PublishProjectModal";

interface ProjectReadinessProps {
  project: Project;
}

export default function ProjectReadiness({
  project,
}: ProjectReadinessProps) {
  const [
    publishOpen,
    setPublishOpen,
  ] = useState(false);

  const steps = [
    {
      label: "Wallet connected",
      description:
        "Connect a compatible wallet.",
      complete: project.progress.wallet,
    },
    {
      label: "Assets added",
      description:
        "Add at least one digital asset.",
      complete: project.progress.assets,
    },
    {
      label: "Metadata complete",
      description:
        "Create and validate your NFT metadata.",
      complete: project.progress.metadata,
    },
    {
      label: "Collection configured",
      description:
        "Complete your collection information.",
      complete: project.progress.collection,
    },
    {
      label: "Storage ready",
      description:
        "Upload required project files to storage.",
      complete: project.progress.storage,
    },
    {
      label: "Published",
      description:
        "Publish the project when everything is ready.",
      complete: project.progress.published,
    },
  ];

  const completedSteps = steps.filter(
    (step) => step.complete
  ).length;

  const percentage = Math.round(
    (completedSteps / steps.length) * 100
  );

  /*
   * Publishing becomes available after
   * the five pre-publish requirements
   * have been completed.
   */
  const readyToPublish =
    project.progress.wallet &&
    project.progress.assets &&
    project.progress.metadata &&
    project.progress.collection &&
    project.progress.storage;

  return (
    <>
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Rocket
                size={20}
                className="text-blue-400"
              />

              <h2 className="text-lg font-semibold text-white">
                Publish Readiness
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Complete these steps before publishing
              your project.
            </p>
          </div>

          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        {/* Checklist */}
        <div className="mt-6 space-y-4">
          {steps.map((step) => (
            <div
              key={step.label}
              className="flex items-start gap-3"
            >
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  step.complete
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step.complete ? (
                  <Check size={14} />
                ) : (
                  <Circle size={12} />
                )}
              </div>

              <div>
                <p
                  className={`text-sm font-medium ${
                    step.complete
                      ? "text-white"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Publish State */}
        <div className="mt-6 border-t border-slate-800 pt-6">
          {project.progress.published ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2">
                <Check
                  size={18}
                  className="text-emerald-400"
                />

                <p className="font-medium text-emerald-400">
                  Project published
                </p>
              </div>

              <p className="mt-2 text-sm text-emerald-400/70">
                This project has completed the publishing
                workflow.
              </p>
            </div>
          ) : readyToPublish ? (
            <button
              type="button"
              onClick={() =>
                setPublishOpen(true)
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              <Rocket size={18} />

              Publish Project
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-slate-800 px-5 py-3 font-medium text-slate-500"
            >
              Complete Requirements to Publish
            </button>
          )}
        </div>
      </section>

      {/* Publish Review Modal */}
      <PublishProjectModal
        open={publishOpen}
        onClose={() =>
          setPublishOpen(false)
        }
        project={project}
      />
    </>
  );
}