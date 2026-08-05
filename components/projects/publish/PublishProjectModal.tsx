"use client";

import { useMemo, useState } from "react";

import {
  Loader2,
  Rocket,
  X,
} from "lucide-react";

import type { Project } from "@/context/project/types";

import { useProject } from "@/context/project/ProjectContext";

import { validateProjectForPublish } from "@/lib/publish/validateProject";

import PublishChecklist from "./PublishChecklist";
import PublishSummary from "./PublishSummary";
import PublishSuccess from "./PublishSuccess";

interface PublishProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

export default function PublishProjectModal({
  open,
  onClose,
  project,
}: PublishProjectModalProps) {
  const { updateProject } = useProject();

  const [publishing, setPublishing] =
    useState(false);

  const [published, setPublished] =
    useState(false);

  /*
   * Validate the project whenever
   * project state changes.
   */
  const validation = useMemo(
    () => validateProjectForPublish(project),
    [project]
  );

  if (!open) {
    return null;
  }

  async function handlePublish() {
    /*
     * Prevent publishing if any
     * prerequisite is incomplete.
     */
    if (!validation.valid) {
      return;
    }

    /*
     * Prevent accidentally publishing
     * an already-published project.
     */
    if (project.progress.published) {
      return;
    }

    setPublishing(true);

    try {
      /*
       * Prototype publishing delay.
       *
       * IMPORTANT:
       * This does NOT submit a real
       * Shelby/Aptos transaction yet.
       */
      await new Promise<void>((resolve) => {
        window.setTimeout(() => {
          resolve();
        }, 1000);
      });

      /*
       * Create a persistent publication
       * record for this project.
       */
      const publishedAt =
        new Date().toISOString();

      const publishRecord = {
        id: crypto.randomUUID(),

        publishedAt,

        network: "Shelbynet",

        mode: "prototype" as const,
      };

      /*
       * Store publication information
       * in ProjectContext.
       *
       * ProjectContext already persists
       * projects to localStorage.
       */
      updateProject({
        status: "published",

        publishedAt,

        publishRecord,

        progress: {
          ...project.progress,
          published: true,
        },
      });

      setPublished(true);
    } catch (error) {
      console.error(
        "Failed to publish project:",
        error
      );
    } finally {
      setPublishing(false);
    }
  }

  function handleClose() {
    /*
     * Do not allow the modal to close
     * while publishing is running.
     */
    if (publishing) {
      return;
    }

    setPublished(false);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {!published ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <Rocket
                    size={20}
                    className="text-blue-400"
                  />

                  <h2 className="text-xl font-bold text-white">
                    Publish Project
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Review your project before completing
                  the publishing workflow.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={publishing}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close publish modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-8 p-6">
              {/* Project Summary */}
              <PublishSummary
                project={project}
              />

              {/* Pre-publish Checklist */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white">
                    Pre-publish Checklist
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Every requirement must be complete
                    before publishing.
                  </p>
                </div>

                <PublishChecklist
                  checks={validation.checks}
                />
              </div>

              {/* Network */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Publishing Network
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                      Shelbynet
                    </p>
                  </div>

                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    Prototype
                  </span>
                </div>
              </div>

              {/* Prototype Notice */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs leading-5 text-blue-200/80">
                  Publishing currently creates a persistent
                  publication record inside Shelby Studio.
                  No blockchain transaction will be submitted
                  during this prototype step.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={publishing}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={
                  !validation.valid ||
                  publishing ||
                  project.progress.published
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {publishing ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Publishing...
                  </>
                ) : (
                  <>
                    <Rocket size={17} />

                    Confirm Publish
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="p-8">
            <PublishSuccess
              projectName={project.name}
              onClose={handleClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}