"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getOwnedNFTs } from "@/services/walletService";

export function useWalletData() {
  const wallet = useWallet();

  const { connected, account } = wallet;

  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);

  // TEMPORARY DEBUGGING
  useEffect(() => {
    console.log("connected:", connected);
    console.log("account:", account);
    console.log("wallet name:", wallet.wallet?.name);

    console.log(
      "has signTransaction:",
      typeof wallet.signTransaction
    );

    console.log(
      "has signAndSubmitTransaction:",
      typeof wallet.signAndSubmitTransaction
    );

    console.log(
      "has signMessage:",
      typeof wallet.signMessage
    );

    console.log(
      "wallet keys:",
      Object.keys(wallet)
    );
  }, [wallet, connected, account]);

  useEffect(() => {
    async function loadWalletData() {
      if (!connected || !account?.address) {
        setNfts([]);
        return;
      }

      try {
        setLoading(true);

        const address = account.address.toString();

        const assets = await getOwnedNFTs(address);

        setNfts(Array.isArray(assets) ? assets : []);
      } catch (error) {
        console.error("Failed to load wallet data:", error);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    }

    loadWalletData();
  }, [connected, account]);

  return {
    connected,
    loading,
    nfts,
    nftCount: nfts.length,
    walletAddress: account?.address?.toString() ?? "",
  };
}