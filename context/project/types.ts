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

/*
 * Every uploaded Shelby asset that
 * belongs to a project.
 *
 * This allows the project to know
 * exactly which files were uploaded
 * without scanning Storage every time.
 */
export interface ProjectAsset {
  uid: string;

  name: string;

  size: number;

  uploadedAt: string;

  network: string;

  blobName?: string;

  owner?: string;

  registrationTransaction?: string;

  commitTransaction?: string;
}

export interface ProjectPublishRecord {
  id: string;

  publishedAt: string;

  network: string;

  mode: PublishMode;

  /*
   * Shelby manifest information.
   */
  manifestBlob?: string;

  owner?: string;

  registrationTransaction?: string;

  commitTransaction?: string;

  assetCount?: number;

storageUsed?: number;

/*
 * Verification.
 */
verified: boolean;

verifiedAt?: string;

/*
 * Future blockchain information.
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

  /*
   * Shelby assets belonging to
   * this specific project.
   */
  projectAssets: ProjectAsset[];
}
