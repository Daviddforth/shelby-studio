"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useProject } from "@/context/project/ProjectContext";
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
}

interface CollectionContextType {
  collection: Collection;

  setCollection: React.Dispatch<
    React.SetStateAction<Collection>
  >;

  resetCollection: () => void;

  hasCollection: boolean;
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
};

const CollectionContext =
  createContext<CollectionContextType | null>(null);

function getStorageKey(
  walletAddress: string,
  projectId: string
) {
  return `shelby-collection:${walletAddress.toLowerCase()}:${projectId}`;
}

export function CollectionProvider({
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

  const [collection, setCollection] =
    useState<Collection>(defaultCollection);

  const [
    loadedStorageKey,
    setLoadedStorageKey,
  ] = useState<string | null>(null);

  /*
   * Load only the collection belonging
   * to the connected wallet + project.
   *
   * Disconnecting immediately clears
   * the visible collection workspace.
   */
  useEffect(() => {
    setLoadedStorageKey(null);

    if (
      !walletConnected ||
      !walletAddress ||
      !activeProject
    ) {
      setCollection(defaultCollection);
      return;
    }

    const storageKey =
      getStorageKey(
        walletAddress,
        activeProject.id
      );

    try {
      const saved =
        localStorage.getItem(
          storageKey
        );

      if (!saved) {
        setCollection(
          defaultCollection
        );
      } else {
        const parsed =
          JSON.parse(saved);

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

      setCollection(
        defaultCollection
      );
    } finally {
      setLoadedStorageKey(
        storageKey
      );
    }
  }, [
    walletConnected,
    walletAddress,
    activeProject?.id,
  ]);

  /*
   * Collection data only counts while
   * the correct wallet/project is active.
   */
  const hasCollection =
    walletConnected &&
    !!walletAddress &&
    !!activeProject &&
    (
      collection.name.trim().length > 0 ||
      collection.symbol.trim().length > 0 ||
      collection.description.trim().length > 0 ||
      collection.creator.trim().length > 0 ||
      collection.banner.trim().length > 0 ||
      collection.logo.trim().length > 0 ||
      collection.category.trim().length > 0
    );

  /*
   * Persist only to the storage key that
   * belongs to the connected wallet and
   * active project.
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
    activeProject?.id,
    loadedStorageKey,
  ]);

  /*
   * Synchronize Collection Builder state
   * with the active Project Dashboard.
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

    const nextCollectionCount =
      hasCollection ? 1 : 0;

    const alreadySynchronized =
      activeProject.collectionCount ===
        nextCollectionCount &&
      activeProject.progress.collection ===
        hasCollection;

    if (alreadySynchronized) {
      return;
    }

    updateProject({
      collectionCount:
        nextCollectionCount,

      progress: {
        ...activeProject.progress,
        collection: hasCollection,
      },
    });
  }, [
    hasCollection,
    walletConnected,
    walletAddress,
    activeProject,
    loadedStorageKey,
    updateProject,
  ]);

  /*
   * Reset only the connected wallet's
   * active project collection.
   */
  function resetCollection() {
    if (
      walletConnected &&
      walletAddress &&
      activeProject
    ) {
      localStorage.removeItem(
        getStorageKey(
          walletAddress,
          activeProject.id
        )
      );
    }

    setCollection(
      defaultCollection
    );
  }

  return (
    <CollectionContext.Provider
      value={{
        collection,
        setCollection,
        resetCollection,
        hasCollection,
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
