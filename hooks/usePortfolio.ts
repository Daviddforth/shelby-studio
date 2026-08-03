"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { getOwnedNFTs } from "@/services/walletService";

export interface PortfolioNFT {
  id: string;
  name: string;
  image?: string;
  collection: string;
  raw: any;
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
        const assets = await getOwnedNFTs(
          account.address.toString()
        );

        const mapped = assets.map((asset: any) => ({
          id:
            asset.token_data_id ??
            asset.token_data_id_hash ??
            asset.asset_type ??
            crypto.randomUUID(),

          name:
            asset.current_token_data?.token_name ??
            asset.current_token_data?.name ??
            asset.name ??
            "Unnamed NFT",

          collection:
            asset.current_collection?.collection_name ??
            asset.collection ??
            "Unknown Collection",

          image:
            asset.current_token_data?.token_uri ??
            asset.image_uri ??
            asset.image,

          raw: asset,
        }));

        setNFTs(mapped);
      } catch (err) {
        console.error(err);
        setNFTs([]);
      } finally {
        setLoading(false);
      }
    }

    loadNFTs();
  }, [connected, account]);

  return {
    loading,
    connected,
    nfts,
    address: account?.address.toString(),
  };
}