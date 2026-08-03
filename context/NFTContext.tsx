"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { NFTMetadata } from "@/types/nft";

interface NFTContextType {
  nft: NFTMetadata;
  setNFT: React.Dispatch<React.SetStateAction<NFTMetadata>>;

  readinessScore: number;
  setReadinessScore: React.Dispatch<React.SetStateAction<number>>;

  uploadStatus: string;
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>;
}

const NFTContext = createContext<NFTContextType | null>(null);

const defaultNFT: NFTMetadata = {
  name: "",
  description: "",
  image: "",
  external_url: "",
  animation_url: "",
  background_color: "",
  attributes: [],
};

export function NFTProvider({ children }: { children: ReactNode }) {
  const [nft, setNFT] = useState(defaultNFT);

  const [readinessScore, setReadinessScore] = useState(0);

  const [uploadStatus, setUploadStatus] = useState("Not Uploaded");

  const value = useMemo(
    () => ({
      nft,
      setNFT,
      readinessScore,
      setReadinessScore,
      uploadStatus,
      setUploadStatus,
    }),
    [nft, readinessScore, uploadStatus]
  );

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
}

export function useNFT() {
  const context = useContext(NFTContext);

  if (!context) {
    throw new Error("useNFT must be used inside NFTProvider");
  }

  return context;
}