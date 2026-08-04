"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { UploadedAsset } from "@/lib/services/storage";

interface StorageContextType {
  assets: UploadedAsset[];
  setAssets: React.Dispatch<
    React.SetStateAction<UploadedAsset[]>
  >;

  search: string;
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
}

const StorageContext =
  createContext<StorageContextType | null>(null);

export function StorageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assets, setAssets] = useState<
    UploadedAsset[]
  >([]);

  const [search, setSearch] =
    useState("");

  return (
    <StorageContext.Provider
      value={{
        assets,
        setAssets,
        search,
        setSearch,
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