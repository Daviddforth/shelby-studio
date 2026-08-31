"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useWallet } from "@/context/WalletContext";

export interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export interface MetadataStorageRecord {
  uid: string;
  name: string;
  blobName: string;
  size: number;
  uploadedAt: string;
  network: string;
  owner: string;
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
  storage: MetadataStorageRecord | null;
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
  storage: null,
};

const MetadataContext =
  createContext<MetadataContextType | null>(null);

function getStorageKey(walletAddress: string) {
  return `shelby-metadata:${walletAddress.toLowerCase()}`;
}

export function MetadataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [metadata, setMetadata] =
    useState<Metadata>(defaultMetadata);

  const [loadedStorageKey, setLoadedStorageKey] =
    useState<string | null>(null);

  /*
   * Metadata belongs to the connected
   * wallet only.
   *
   * It is not tied to a project.
   */
  useEffect(() => {
    setLoadedStorageKey(null);

    if (
      !walletConnected ||
      !walletAddress
    ) {
      setMetadata(defaultMetadata);
      return;
    }

    const storageKey =
      getStorageKey(walletAddress);

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
  ]);

  const hasMetadata =
    walletConnected &&
    !!walletAddress &&
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
   * Persist metadata independently.
   *
   * No project-specific ID.
   */
  useEffect(() => {
    if (
      !walletConnected ||
      !walletAddress ||
      !loadedStorageKey
    ) {
      return;
    }

    const expectedStorageKey =
      getStorageKey(walletAddress);

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
    loadedStorageKey,
  ]);

  function resetMetadata() {
    if (
      walletConnected &&
      walletAddress
    ) {
      localStorage.removeItem(
        getStorageKey(walletAddress)
      );
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
