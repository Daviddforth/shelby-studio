import type { Project } from "@/context/project/types";

import {
  formatPublishDate,
  getExplorerUrl,
  getPublicationStatus,
  getStorageUri,
  getTransactionHash,
  isProjectPublished,
  isPublicationComplete,
} from "./publication";

export interface ProjectView {
  id: string;

  title: string;

  description: string;

  status: string;

  published: boolean;

  publicationComplete: boolean;

  publishedDate: string | null;

  assetCount: number;

  metadataCount: number;

  collectionCount: number;

  storageUsed: number;

  owner: string | null;

  network: string | null;

  manifestBlob: string | null;

  registrationTransaction: string | null;

  commitTransaction: string | null;

  transactionHash: string | null;

  storageUri: string | null;

  explorerUrl: string | null;

  publicationStatus: ReturnType<
    typeof getPublicationStatus
  >;

  projectAssets: Project["projectAssets"];
}

export function buildProjectView(
  project: Project
): ProjectView {
  const record =
    project.publishRecord;

  return {
    id: project.id,

    title: project.name,

    description:
      project.description,

    status: project.status,

    published:
      isProjectPublished(project),

    publicationComplete:
      isPublicationComplete(
        project
      ),

    publishedDate:
      formatPublishDate(project),

    assetCount:
      project.assetCount,

    metadataCount:
      project.metadataCount,

    collectionCount:
      project.collectionCount,

    storageUsed:
      project.storageUsed,

    owner:
      record?.owner ?? null,

    network:
      record?.network ?? null,

    manifestBlob:
      record?.manifestBlob ?? null,

    registrationTransaction:
      record?.registrationTransaction ??
      null,

    commitTransaction:
      record?.commitTransaction ??
      null,

    transactionHash:
      getTransactionHash(project),

    storageUri:
      getStorageUri(project),

    explorerUrl:
      getExplorerUrl(project),

    publicationStatus:
      getPublicationStatus(project),

    projectAssets:
      project.projectAssets,
  };
}