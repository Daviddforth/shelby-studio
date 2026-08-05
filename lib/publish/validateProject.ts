import type { Project } from "@/context/project/types";

import type {
  PublishCheck,
  PublishValidationResult,
} from "./types";

export function validateProjectForPublish(
  project: Project
): PublishValidationResult {
  const checks: PublishCheck[] = [
    {
      id: "wallet",
      label: "Wallet connected",
      description:
        "A compatible Aptos wallet must be connected.",
      status: project.progress.wallet
        ? "complete"
        : "incomplete",
    },

    {
      id: "assets",
      label: "Assets added",
      description:
        "The project must contain at least one stored asset.",
      status:
        project.progress.assets &&
        project.assetCount > 0
          ? "complete"
          : "incomplete",
    },

    {
      id: "metadata",
      label: "Metadata complete",
      description:
        "NFT metadata must be created before publishing.",
      status:
        project.progress.metadata &&
        project.metadataCount > 0
          ? "complete"
          : "incomplete",
    },

    {
      id: "collection",
      label: "Collection configured",
      description:
        "Collection information must be configured.",
      status:
        project.progress.collection &&
        project.collectionCount > 0
          ? "complete"
          : "incomplete",
    },

    {
      id: "storage",
      label: "Storage ready",
      description:
        "Project assets must be available in storage.",
      status:
        project.progress.storage &&
        project.storageUsed > 0
          ? "complete"
          : "incomplete",
    },
  ];

  return {
    valid: checks.every(
      (check) => check.status === "complete"
    ),

    checks,
  };
}