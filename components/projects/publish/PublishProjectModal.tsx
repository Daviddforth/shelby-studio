"use client";

import { useMemo, useState } from "react";

import {
  AlertCircle,
  Loader2,
  Rocket,
  X,
} from "lucide-react";

import type { Project } from "@/context/project/types";

import { useProject } from "@/context/project/ProjectContext";
import { useStorage } from "@/hooks/useStorage";

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

  const {
    upload,
    loading: storageLoading,
  } = useStorage();

  const [publishing, setPublishing] =
    useState(false);

  const [published, setPublished] =
    useState(false);

  const [publishError, setPublishError] =
    useState<string | null>(null);

  const validation = useMemo(
    () => validateProjectForPublish(project),
    [project]
  );

  if (!open) {
    return null;
  }

  async function handlePublish() {
    if (!validation.valid) {
      return;
    }

    if (project.progress.published) {
      return;
    }

    setPublishing(true);
    setPublishError(null);

    try {
      /*
       * Build the project publication manifest.
       *
       * This manifest becomes the permanent
       * Shelby publication record for the project.
       */
      const publishedAt =
        new Date().toISOString();

      const manifest = {
        schema: "shelby-studio-project-v1",

        project: {
          id: project.id,
          name: project.name,
          description: project.description,
        },

        network: "Shelbynet",

        publishedAt,

        stats: {
          assets: project.assetCount,
          metadata: project.metadataCount,
          collections: project.collectionCount,
          storageUsed: project.storageUsed,
        },

        progress: {
          ...project.progress,
          published: true,
        },
      };

      /*
       * Convert the manifest into a real
       * JSON file for Shelby Storage.
       */
      const manifestFile = new File(
        [
          JSON.stringify(
            manifest,
            null,
            2
          ),
        ],
        `shelby-project-${project.id}.json`,
        {
          type: "application/json",
        }
      );

      /*
       * REAL SHELBY PUBLISH.
       *
       * This uses the same Shelby upload
       * pipeline as the Storage workspace.
       *
       * The wallet should request approval
       * as part of the Shelby registration
       * transaction.
       */
      const publishedAsset =
        await upload(manifestFile);

      /*
       * IMPORTANT:
       *
       * We only mark the project as published
       * AFTER Shelby upload succeeds.
       */
      updateProject({
        status: "published",

        publishedAt,

        publishRecord: {
          id: crypto.randomUUID(),

          publishedAt,

          network: "Shelbynet",

          mode: "onchain",

          verified: true,

          verifiedAt: publishedAt,

          storageUri:
            publishedAsset.blobName,

          transactionHash:
            publishedAsset.commitTransaction ??
            publishedAsset.registrationTransaction,
        },

        progress: {
          ...project.progress,
          published: true,
        },
      });

      setPublished(true);
    } catch (error) {
      console.error(
        "Failed to publish project to Shelby:",
        error
      );

      setPublishError(
        error instanceof Error
          ? error.message
          : "Failed to publish project to Shelby."
      );
    } finally {
      setPublishing(false);
    }
  }

  function handleClose() {
    if (
      publishing ||
      storageLoading
    ) {
      return;
    }

    setPublished(false);
    setPublishError(null);

    onClose();
  }

  const isPublishing =
    publishing || storageLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {!published ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                    <Rocket
                      size={20}
                      className="text-blue-400"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-white">
                    Publish Project
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Review your project before publishing
                  its manifest to Shelby.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isPublishing}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close publish modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-8 p-6">
              <PublishSummary
                project={project}
              />

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

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    Shelby Storage
                  </span>
                </div>
              </div>

              {/* Transaction Notice */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Rocket
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-blue-300">
                      Wallet approval required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-200/70">
                      Publishing creates a project manifest
                      and stores it through Shelby. Your
                      connected wallet may request approval
                      for the Shelby registration transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error */}
              {publishError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-red-400">
                      Publishing failed
                    </p>

                    <p className="mt-1 break-words text-xs leading-5 text-red-300/80">
                      {publishError}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 p-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPublishing}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={
                  !validation.valid ||
                  isPublishing ||
                  project.progress.published
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPublishing ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Publishing to Shelby...
                  </>
                ) : (
                  <>
                    <Rocket size={17} />

                    Publish to Shelby
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




