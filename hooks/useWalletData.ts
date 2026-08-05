"use client";

import {
  useEffect,
  useState,
} from "react";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

import { getOwnedNFTs } from "@/services/walletService";

export function useWalletData() {
  const {
    connected,
    account,
  } = useWallet();

  const [loading, setLoading] =
    useState(false);

  const [nfts, setNfts] =
    useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadWalletData() {
      /*
       * A disconnected wallet must never
       * retain NFT data from a previous
       * wallet session.
       */
      if (
        !connected ||
        !account?.address
      ) {
        setNfts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const address =
          account.address.toString();

        const assets =
          await getOwnedNFTs(address);

        if (cancelled) {
          return;
        }

        setNfts(
          Array.isArray(assets)
            ? assets
            : []
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load wallet NFTs:",
          error
        );

        setNfts([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWalletData();

    return () => {
      cancelled = true;
    };
  }, [
    connected,
    account?.address,
  ]);

  return {
    connected,
    loading,
    nfts,

    nftCount:
      connected
        ? nfts.length
        : 0,

    walletAddress:
      connected
        ? account?.address?.toString() ?? ""
        : "",
  };
}
