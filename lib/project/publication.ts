import type { Project } from "@/context/project/types";

const EXPLORER_BASE_URL =
  process.env.NEXT_PUBLIC_SHELBY_EXPLORER;

export function isProjectPublished(
  project: Project
): boolean {
  return Boolean(project.publishRecord?.id);
}

export function isPublicationComplete(
  project: Project
): boolean {
  const record = project.publishRecord;

  if (!record) {
    return false;
  }

  return Boolean(
    record.id &&
      record.registrationTransaction &&
      record.commitTransaction &&
      record.storageUri
  );
}

export interface PublicationStage {
  completed: boolean;
  label: string;
}

export interface PublicationStatus {
  manifest: PublicationStage;
  registered: PublicationStage;
  uploaded: PublicationStage;
  committed: PublicationStage;
  published: PublicationStage;
}

export function getPublicationStatus(
  project: Project
): PublicationStatus {
  const record = project.publishRecord;

  return {
    manifest: {
      completed: Boolean(record?.manifestBlob),
      label: "Manifest Created",
    },

    registered: {
      completed: Boolean(
        record?.registrationTransaction
      ),
      label: "Registered",
    },

    uploaded: {
      completed: Boolean(record?.storageUri),
      label: "Uploaded",
    },

    committed: {
      completed: Boolean(
        record?.commitTransaction
      ),
      label: "Committed",
    },

    published: {
      completed: Boolean(
        record?.id &&
          record?.publishedAt
      ),
      label: "Published",
    },
  };
}

export function formatPublishDate(
  project: Project
): string | null {
  const publishedAt =
    project.publishRecord?.publishedAt;

  if (!publishedAt) {
    return null;
  }

  return new Date(
    publishedAt
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getTransactionHash(
  project: Project
): string | null {
  return (
    project.publishRecord?.transactionHash ??
    null
  );
}

export function getStorageUri(
  project: Project
): string | null {
  return (
    project.publishRecord?.storageUri ??
    null
  );
}

export function getExplorerUrl(
  project: Project
): string | null {
  const tx =
    getTransactionHash(project);

  if (
    !tx ||
    !EXPLORER_BASE_URL
  ) {
    return null;
  }

  return `${EXPLORER_BASE_URL}/tx/${tx}`;
}