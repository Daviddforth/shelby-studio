"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useProject } from "@/context/project/ProjectContext";
import { useWallet } from "@/context/WalletContext";

export interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export interface Metadata {
  name: string;
  description: string;
  collection: string;
  image: string;
  imagePreview: string;
  animation_url: string;
  external_url: string;
  attributes: MetadataAttribute[];
}

interface MetadataContextType {
  metadata: Metadata;

  setMetadata: React.Dispatch<
    React.SetStateAction<Metadata>
  >;

  resetMetadata: () => void;

  hasMetadata: boolean;
}

const defaultMetadata: Metadata = {
  name: "",
  description: "",
  collection: "",
  image: "",
  imagePreview: "",
  animation_url: "",
  external_url: "",
  attributes: [],
};

const MetadataContext =
  createContext<MetadataContextType | null>(null);

export function MetadataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    activeProject,
    updateProject,
  } = useProject();

  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [metadata, setMetadata] =
    useState<Metadata>(defaultMetadata);

  const [
    loadedStorageKey,
    setLoadedStorageKey,
  ] = useState<string | null>(null);

  /*
   * Metadata belongs to BOTH:
   *
   * 1. Connected wallet
   * 2. Active project
   *
   * This prevents one wallet from seeing
   * another wallet's project metadata.
   */
  function getStorageKey(
    address: string,
    projectId: string
  ) {
    return `shelby-metadata-${address.toLowerCase()}-${projectId}`;
  }

  /*
   * Load metadata only when:
   *
   * - wallet is connected
   * - wallet address exists
   * - active project exists
   *
   * Otherwise Shelby Studio must look fresh.
   */
  useEffect(() => {
    if (
      !walletConnected ||
      !walletAddress ||
      !activeProject
    ) {
      setMetadata(defaultMetadata);
      setLoadedStorageKey(null);

      return;
    }

    const storageKey = getStorageKey(
      walletAddress,
      activeProject.id
    );

    try {
      const saved =
        localStorage.getItem(storageKey);

      if (!saved) {
        setMetadata(defaultMetadata);
      } else {
        const parsed = JSON.parse(saved);

        setMetadata({
          ...defaultMetadata,
          ...parsed,
        });
      }
    } catch (error) {
      console.error(
        "Failed to load metadata:",
        error
      );

      setMetadata(defaultMetadata);
    }

    setLoadedStorageKey(storageKey);
  }, [
    walletConnected,
    walletAddress,
    activeProject?.id,
  ]);

  /*
   * Metadata only counts when the wallet
   * is actually connected.
   */
  const hasMetadata =
    walletConnected &&
    !!walletAddress &&
    !!activeProject &&
    (
      metadata.name.trim().length > 0 ||
      metadata.description.trim().length > 0 ||
      metadata.collection.trim().length > 0 ||
      metadata.image.trim().length > 0 ||
      metadata.animation_url.trim().length > 0 ||
      metadata.external_url.trim().length > 0 ||
      metadata.attributes.length > 0
    );

  /*
   * Save only to the currently loaded
   * wallet/project storage key.
   *
   * Nothing is persisted while disconnected.
   */
  useEffect(() => {
    if (
      !walletConnected ||
      !walletAddress ||
      !activeProject ||
      !loadedStorageKey
    ) {
      return;
    }

    const expectedStorageKey =
      getStorageKey(
        walletAddress,
        activeProject.id
      );

    if (
      loadedStorageKey !==
      expectedStorageKey
    ) {
      return;
    }

    try {
      localStorage.setItem(
        loadedStorageKey,
        JSON.stringify(metadata)
      );
    } catch (error) {
      console.error(
        "Failed to save metadata:",
        error
      );
    }
  }, [
    metadata,
    walletConnected,
    walletAddress,
    activeProject?.id,
    loadedStorageKey,
  ]);

  /*
   * Synchronize metadata statistics with
   * the active project only while the
   * wallet is connected.
   */
  useEffect(() => {
    if (
      !walletConnected ||
      !walletAddress ||
      !activeProject ||
      !loadedStorageKey
    ) {
      return;
    }

    const nextMetadataCount =
      hasMetadata ? 1 : 0;

    const alreadySynchronized =
      activeProject.metadataCount ===
        nextMetadataCount &&
      activeProject.progress.metadata ===
        hasMetadata;

    if (alreadySynchronized) {
      return;
    }

    updateProject({
      metadataCount: nextMetadataCount,

      progress: {
        ...activeProject.progress,
        metadata: hasMetadata,
      },
    });
  }, [
    hasMetadata,
    walletConnected,
    walletAddress,
    activeProject,
    loadedStorageKey,
    updateProject,
  ]);

  /*
   * Reset only the connected wallet's
   * active project metadata.
   */
  function resetMetadata() {
    if (
      walletConnected &&
      walletAddress &&
      activeProject
    ) {
      const storageKey =
        getStorageKey(
          walletAddress,
          activeProject.id
        );

      localStorage.removeItem(storageKey);
    }

    setMetadata(defaultMetadata);
  }

  return (
    <MetadataContext.Provider
      value={{
        metadata,
        setMetadata,
        resetMetadata,
        hasMetadata,
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
}

export function useMetadata() {
  const context =
    useContext(MetadataContext);

  if (!context) {
    throw new Error(
      "useMetadata must be used inside MetadataProvider"
    );
  }

  return context;
}
