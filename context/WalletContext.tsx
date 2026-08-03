"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from "react";

import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";

interface WalletContextType {
  walletAddress: string | null;
  walletConnected: boolean;
  network: string;
  account: any;
  signAndSubmitTransaction: any;
  signMessage: any;
  disconnectWallet: () => void;
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
    network,
    disconnect,
    signAndSubmitTransaction,
    signMessage,
  } = useAptosWallet();

  const value = useMemo(
    () => ({
      walletAddress: account?.address?.toString() ?? null,
      walletConnected: connected,
      network: network?.name ?? "Shelbynet",
      account,
      signAndSubmitTransaction,
      signMessage,
      disconnectWallet: disconnect,
    }),
    [
      account,
      connected,
      network,
      disconnect,
      signAndSubmitTransaction,
      signMessage,
    ]
  );

  return (
    <WalletContext.Provider value={value}>
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