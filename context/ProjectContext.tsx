"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import type { UploadedAsset } from "@/lib/services/storage";
import { useProject } from "@/context/project/ProjectContext";

interface StorageContextType {
  assets: UploadedAsset[];

  setAssets: React.Dispatch<
    React.SetStateAction<UploadedAsset[]>
  >;

  search: string;

  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;

  storageUsed: number;
}

const StorageContext =
  createContext<StorageContextType | null>(null);

export function StorageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    activeProject,
    updateProject,
  } = useProject();

  const [assets, setAssets] = useState<
    UploadedAsset[]
  >([]);

  const [search, setSearch] =
    useState("");

  const [
    loadedProjectId,
    setLoadedProjectId,
  ] = useState<string | null>(null);

  function getStorageKey(projectId: string) {
    return `shelby-storage-${projectId}`;
  }

  /*
   * Load assets belonging to the
   * currently active project.
   */
  useEffect(() => {
    if (!activeProject) {
      setAssets([]);
      setLoadedProjectId(null);

      return;
    }

    try {
      const saved = localStorage.getItem(
        getStorageKey(activeProject.id)
      );

      if (!saved) {
        setAssets([]);
      } else {
        const parsed = JSON.parse(saved);

        setAssets(
          Array.isArray(parsed)
            ? parsed
            : []
        );
      }
    } catch (error) {
      console.error(
        "Failed to load project storage:",
        error
      );

      setAssets([]);
    }

    setLoadedProjectId(activeProject.id);
  }, [activeProject?.id]);

  /*
   * Calculate actual storage usage.
   */
  const storageUsed = assets.reduce(
    (total, asset) =>
      total + (asset.size || 0),
    0
  );

  /*
   * Save project assets whenever
   * the asset list changes.
   */
  useEffect(() => {
    if (
      !activeProject ||
      loadedProjectId !== activeProject.id
    ) {
      return;
    }

    try {
      localStorage.setItem(
        getStorageKey(activeProject.id),
        JSON.stringify(assets)
      );
    } catch (error) {
      console.error(
        "Failed to save project storage:",
        error
      );
    }
  }, [
    assets,
    activeProject?.id,
    loadedProjectId,
  ]);

  /*
   * Synchronize storage with the
   * Project Dashboard.
   */
  useEffect(() => {
    if (
      !activeProject ||
      loadedProjectId !== activeProject.id
    ) {
      return;
    }

    const storedAssets = assets.filter(
      (asset) => asset.status === "Stored"
    );

    const assetCount = storedAssets.length;

    const hasAssets =
      assetCount > 0;

    const hasStorage =
      storageUsed > 0;

    const alreadySynchronized =
      activeProject.assetCount ===
        assetCount &&
      activeProject.storageUsed ===
        storageUsed &&
      activeProject.progress.assets ===
        hasAssets &&
      activeProject.progress.storage ===
        hasStorage;

    if (alreadySynchronized) {
      return;
    }

    updateProject({
      assetCount,

      storageUsed,

      progress: {
        ...activeProject.progress,
        assets: hasAssets,
        storage: hasStorage,
      },
    });
  }, [
    assets,
    storageUsed,
    activeProject,
    loadedProjectId,
    updateProject,
  ]);

  return (
    <StorageContext.Provider
      value={{
        assets,
        setAssets,
        search,
        setSearch,
        storageUsed,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageContext() {
  const context =
    useContext(StorageContext);

  if (!context) {
    throw new Error(
      "useStorageContext must be used inside StorageProvider"
    );
  }

  return context;
}