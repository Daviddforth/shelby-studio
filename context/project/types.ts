export type ProjectStatus =
  | "draft"
  | "ready"
  | "published";

export interface ProjectProgress {
  wallet: boolean;
  assets: boolean;
  metadata: boolean;
  collection: boolean;
  storage: boolean;
  published: boolean;
}

export type PublishMode =
  | "prototype"
  | "onchain";

export interface ProjectPublishRecord {
  id: string;

  publishedAt: string;

  network: string;

  mode: PublishMode;

  /*
   * These become useful when real
   * Shelby/Aptos publishing is connected.
   */
  transactionHash?: string;

  collectionAddress?: string;

  storageUri?: string;

  explorerUrl?: string;
}

export interface Project {
  id: string;

  name: string;

  description: string;

  status: ProjectStatus;

  createdAt: string;

  updatedAt: string;

  /*
   * Publication information.
   *
   * Null means the project has never
   * been published.
   */
  publishedAt: string | null;

  publishRecord: ProjectPublishRecord | null;

  progress: ProjectProgress;

  assetCount: number;

  metadataCount: number;

  collectionCount: number;

  storageUsed: number;
}