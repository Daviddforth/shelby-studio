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

function getStorageKey(walletAddress: string) {
  return `shelby-storage:${walletAddress.toLowerCase()}`;
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
   * Storage belongs ONLY to the
   * connected wallet.
   *
   * Storage belongs directly to the connected wallet.
   */
  const currentStorageKey =
    useMemo(() => {
      if (!walletAddress) {
        return null;
      }

      return getStorageKey(walletAddress);
    }, [walletAddress]);

  /*
   * Load wallet storage.
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
   * Total bytes stored by the wallet.
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
   * Persist wallet storage.
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

  const visibleAssets =
    walletAddress &&
    loadedStorageKey ===
      currentStorageKey
      ? assets
      : [];

  const visibleStorageUsed =
    walletAddress &&
    loadedStorageKey ===
      currentStorageKey
      ? storageUsed
      : 0;

  return (
    <StorageContext.Provider
      value={{
        assets: visibleAssets,
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
    useContext(StorageContext);

  if (!context) {
    throw new Error(
      "useStorageContext must be used inside StorageProvider"
    );
  }

  return context;
}
