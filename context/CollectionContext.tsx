"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useWallet } from "@/context/WalletContext";

export interface Collection {
  name: string;
  symbol: string;
  description: string;
  creator: string;
  banner: string;
  logo: string;
  royalty: number;
  category: string;
  visibility: "Private" | "Public";
  metadataAttached: boolean;
}

interface CollectionContextType {
  collection: Collection;

  setCollection: React.Dispatch<
    React.SetStateAction<Collection>
  >;

  resetCollection: () => void;

  attachMetadata: () => void;
  detachMetadata: () => void;

  hasCollection: boolean;
  metadataAttached: boolean;
}

const defaultCollection: Collection = {
  name: "",
  symbol: "",
  description: "",
  creator: "",
  banner: "",
  logo: "",
  royalty: 5,
  category: "",
  visibility: "Private",
  metadataAttached: false,
};

const CollectionContext =
  createContext<CollectionContextType | null>(null);

function getStorageKey(walletAddress: string) {
  return `shelby-collection:${walletAddress.toLowerCase()}`;
}

export function CollectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [collection, setCollection] =
    useState<Collection>(defaultCollection);

  const [loadedStorageKey, setLoadedStorageKey] =
    useState<string | null>(null);

  /*
   * Collection belongs to the connected
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
      setCollection(defaultCollection);
      return;
    }

    const storageKey =
      getStorageKey(walletAddress);

    try {
      const saved =
        localStorage.getItem(storageKey);

      if (!saved) {
        setCollection(defaultCollection);
      } else {
        const parsed = JSON.parse(saved);

        setCollection({
          ...defaultCollection,
          ...parsed,
        });
      }
    } catch (error) {
      console.error(
        "Failed to load collection:",
        error
      );

      setCollection(defaultCollection);
    }

    setLoadedStorageKey(storageKey);
  }, [
    walletConnected,
    walletAddress,
  ]);

  /*
   * Collection exists when at least one
   * meaningful collection field is filled.
   */
  const hasCollection =
    walletConnected &&
    !!walletAddress &&
    (
      collection.name.trim().length > 0 ||
      collection.symbol.trim().length > 0 ||
      collection.description.trim().length > 0 ||
      collection.creator.trim().length > 0 ||
      collection.banner.trim().length > 0 ||
      collection.logo.trim().length > 0 ||
      collection.category.trim().length > 0
    );

  const metadataAttached =
    walletConnected &&
    !!walletAddress &&
    collection.metadataAttached;

  /*
   * Persist collection independently.
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
        JSON.stringify(collection)
      );
    } catch (error) {
      console.error(
        "Failed to save collection:",
        error
      );
    }
  }, [
    collection,
    walletConnected,
    walletAddress,
    loadedStorageKey,
  ]);

  /*
   * Attach metadata to the collection
   * without making either workspace
   * belong to a project-specific workspace.
   */
  function attachMetadata() {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      return;
    }

    setCollection((previous) => ({
      ...previous,
      metadataAttached: true,
    }));
  }

  function detachMetadata() {
    setCollection((previous) => ({
      ...previous,
      metadataAttached: false,
    }));
  }

  function resetCollection() {
    if (
      walletConnected &&
      walletAddress
    ) {
      localStorage.removeItem(
        getStorageKey(walletAddress)
      );
    }

    setCollection(defaultCollection);
  }

  return (
    <CollectionContext.Provider
      value={{
        collection,
        setCollection,
        resetCollection,
        attachMetadata,
        detachMetadata,
        hasCollection,
        metadataAttached,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context =
    useContext(CollectionContext);

  if (!context) {
    throw new Error(
      "useCollection must be used inside CollectionProvider"
    );
  }

  return context;
}
