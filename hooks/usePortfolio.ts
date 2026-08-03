"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

export interface PortfolioNFT {
  id: string;
  name: string;
  image?: string;
  collection: string;
}

export function usePortfolio() {
  const { account, connected } = useWallet();

  const [loading, setLoading] = useState(false);
  const [nfts, setNFTs] = useState<PortfolioNFT[]>([]);

  useEffect(() => {
    async function loadNFTs() {
      if (!connected || !account) {
        setNFTs([]);
        return;
      }

      setLoading(true);

      try {
        // Temporary placeholder.
        // Next we'll replace this with Shelby SDK.
        setNFTs([
          {
            id: "1",
            name: "Shelby Genesis",
            collection: "Shelby",
          },
          {
            id: "2",
            name: "Studio Pass",
            collection: "Shelby",
          },
          {
            id: "3",
            name: "Builder Badge",
            collection: "Shelby",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadNFTs();
  }, [connected, account]);

  return {
    loading,
    nfts,
    connected,
    address: account?.address?.toString(),
  };
}