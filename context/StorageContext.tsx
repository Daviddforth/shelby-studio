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

  loading: boolean;

  error: string | null;

  refreshAssets: () => Promise<void>;
}

const StorageContext =
  createContext<StorageContextType | null>(null);

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

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const refreshAssets = async () => {
    if (!walletAddress) {
      setAssets([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/shelby/assets?walletAddress=${encodeURIComponent(
          walletAddress
        )}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Unable to load Shelby assets."
        );
      }

      setAssets(
        Array.isArray(result.assets)
          ? result.assets
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load Shelby assets:",
        err
      );

      setAssets([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Shelby assets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch("");

    if (!walletAddress) {
      setAssets([]);
      setError(null);
      return;
    }

    void refreshAssets();
  }, [walletAddress]);

  const storageUsed = useMemo(
    () =>
      assets.reduce(
        (total, asset) =>
          total + (Number(asset.size) || 0),
        0
      ),
    [assets]
  );

  const value = useMemo(
    () => ({
      assets,
      setAssets,
      search,
      setSearch,
      storageUsed,
      loading,
      error,
      refreshAssets,
    }),
    [
      assets,
      search,
      storageUsed,
      loading,
      error,
    ]
  );

  return (
    <StorageContext.Provider value={value}>
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
