import type { Project } from "./types";

export const defaultProject: Project = {
  id: crypto.randomUUID(),

  name: "Untitled Project",

  description: "",

  status: "draft",

  createdAt: new Date().toISOString(),

  updatedAt: new Date().toISOString(),

  publishedAt: null,

  publishRecord: null,

  progress: {
    wallet: false,

    assets: false,

    metadata: false,

    collection: false,

    storage: false,

    published: false,
  },

  assetCount: 0,

  metadataCount: 0,

  collectionCount: 0,

  storageUsed: 0,

  /*
   * Shelby assets that belong
   * to this project.
   */
  projectAssets: [],
};
