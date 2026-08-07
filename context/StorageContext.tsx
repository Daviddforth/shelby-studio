"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";

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
  createContext<StorageContextType | null>(
    null
  );

function getStorageKey(
  walletAddress: string,
  projectId: string
) {
  return `shelby-storage:${walletAddress.toLowerCase()}:${projectId}`;
}

export function StorageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    connected,
    account,
  } = useAptosWallet();

  const {
    activeProject,
    updateProject,
  } = useProject();

  const walletAddress = connected
    ? account?.address?.toString() ?? null
    : null;

  const [assets, setAssets] =
    useState<UploadedAsset[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    loadedStorageKey,
    setLoadedStorageKey,
  ] = useState<string | null>(null);

  /*
   * Storage belongs to BOTH
   * the connected wallet and
   * the active project.
   */
  const currentStorageKey =
    useMemo(() => {
      if (
        !walletAddress ||
        !activeProject
      ) {
        return null;
      }

      return getStorageKey(
        walletAddress,
        activeProject.id
      );
    }, [
      walletAddress,
      activeProject?.id,
    ]);

  /*
   * Load storage.
   */
  useEffect(() => {
    setLoadedStorageKey(null);
    setSearch("");

    if (!currentStorageKey) {
      setAssets([]);
      return;
    }

    try {
      const saved =
        localStorage.getItem(
          currentStorageKey
        );

      if (!saved) {
        setAssets([]);
      } else {
        const parsed =
          JSON.parse(saved);

        setAssets(
          Array.isArray(parsed)
            ? parsed
            : []
        );
      }
    } catch (error) {
      console.error(
        "Failed to load storage:",
        error
      );

      setAssets([]);
    } finally {
      setLoadedStorageKey(
        currentStorageKey
      );
    }
  }, [currentStorageKey]);

  /*
   * Total bytes.
   */
  const storageUsed =
    useMemo(
      () =>
        assets.reduce(
          (total, asset) =>
            total + asset.size,
          0
        ),
      [assets]
    );

  /*
   * Persist storage.
   */
  useEffect(() => {
    if (
      !currentStorageKey ||
      loadedStorageKey !==
        currentStorageKey
    ) {
      return;
    }

    try {
      localStorage.setItem(
        currentStorageKey,
        JSON.stringify(assets)
      );
    } catch (error) {
      console.error(
        "Failed to save storage:",
        error
      );
    }
  }, [
    assets,
    currentStorageKey,
    loadedStorageKey,
  ]);

  /*
   * Synchronize Project
   * with uploaded Shelby assets.
   */
  useEffect(() => {
    if (
      !walletAddress ||
      !activeProject ||
      !currentStorageKey ||
      loadedStorageKey !==
        currentStorageKey
    ) {
      return;
    }

    const storedAssets =
      assets.filter(
        (asset) =>
          asset.status ===
          "Stored"
      );

    const assetCount =
      storedAssets.length;

    const hasAssets =
      assetCount > 0;

    const hasStorage =
      storageUsed > 0;

    const projectAssets =
      storedAssets.map(
        (asset) => ({
          uid: asset.uid,

          name: asset.name,

          size: asset.size,

          uploadedAt:
            asset.uploadedAt,

          network:
            asset.network,

          blobName:
            asset.blobName,

          owner:
            asset.owner,

          registrationTransaction:
            asset.registrationTransaction,

          commitTransaction:
            asset.commitTransaction,
        })
      );

    const alreadySynchronized =
      activeProject.assetCount ===
        assetCount &&
      activeProject.storageUsed ===
        storageUsed &&
      activeProject.progress.assets ===
        hasAssets &&
      activeProject.progress.storage ===
        hasStorage &&
      JSON.stringify(
        activeProject.projectAssets
      ) ===
        JSON.stringify(
          projectAssets
        );

    if (
      alreadySynchronized
    ) {
      return;
    }

    updateProject({
      assetCount,

      storageUsed,

      projectAssets,

      progress: {
        ...activeProject.progress,

        assets: hasAssets,

        storage: hasStorage,
      },
    });
  }, [
    assets,
    storageUsed,
    walletAddress,
    activeProject,
    currentStorageKey,
    loadedStorageKey,
    updateProject,
  ]);

  const visibleAssets =
    walletAddress &&
    activeProject &&
    loadedStorageKey ===
      currentStorageKey
      ? assets
      : [];

  const visibleStorageUsed =
    walletAddress &&
    activeProject &&
    loadedStorageKey ===
      currentStorageKey
      ? storageUsed
      : 0;

  return (
    <StorageContext.Provider
      value={{
        assets:
          visibleAssets,
        setAssets,
        search,
        setSearch,
        storageUsed:
          visibleStorageUsed,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageContext() {
  const context =
    useContext(
      StorageContext
    );

  if (!context) {
    throw new Error(
      "useStorageContext must be used inside StorageProvider"
    );
  }

  return context;
}
