"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";

import { getOwnedNFTs } from "../lib/getOwnedNFTs";

interface WalletContextType {
  walletAddress: string | null;

  walletConnected: boolean;

  network: "Not Connected" | "Testnet" | "Mainnet";

  isShelbyHolder: boolean;

  storageConnected: boolean;

  ownedNFTs: any[];

  loadingNFTs: boolean;

  refreshNFTs: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    account,
    connected,
  } = useAptosWallet();

  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);

  const [loadingNFTs, setLoadingNFTs] = useState(false);

  const walletAddress = account?.address.toString() ?? null;

  async function refreshNFTs() {
    if (!walletAddress) {
      setOwnedNFTs([]);
      return;
    }

    try {
      setLoadingNFTs(true);

      const nfts = await getOwnedNFTs(walletAddress);

      setOwnedNFTs(nfts);
    } catch (err) {
      console.error(err);
      setOwnedNFTs([]);
    } finally {
      setLoadingNFTs(false);
    }
  }

  useEffect(() => {
    refreshNFTs();
  }, [walletAddress]);

  const isShelbyHolder = ownedNFTs.some((nft: any) => {
    const collection =
      nft.current_token_data?.current_collection?.collection_name ??
      "";

    return collection.toLowerCase().includes("shelby");
  });

  return (
    <WalletContext.Provider
      value={{
        walletAddress,

        walletConnected: connected,

        network: connected
          ? "Testnet"
          : "Not Connected",

        isShelbyHolder,

        storageConnected: false,

        ownedNFTs,

        loadingNFTs,

        refreshNFTs,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      "useWallet must be used inside WalletProvider"
    );
  }

  return context;
}