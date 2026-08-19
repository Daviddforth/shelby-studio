"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
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

  // Shelby
  isShelbyHolder: boolean;
  storageConnected: boolean;
}

const WalletContext = createContext<
  WalletContextType | undefined
>(undefined);

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    account,
    connected,
    disconnect,
    signAndSubmitTransaction,
    signMessage,
  } = useAptosWallet();



  const value = useMemo(
    () => ({
      walletAddress: connected
        ? account?.address?.toString() ?? null
        : null,

      walletConnected: connected,

      // Shelby Studio targets Shelbynet
      network: "Shelbynet",

      account,

      signAndSubmitTransaction,

      signMessage,

      disconnectWallet: disconnect,

      /*
       * These will become real once
       * Shelby APIs are connected.
       */
      isShelbyHolder: false,

      storageConnected: false,
    }),
    [
      account,
      connected,
      disconnect,
      signAndSubmitTransaction,
      signMessage,
    ]
  );

  return (
    <WalletContext.Provider
      value={value}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context =
    useContext(WalletContext);

  if (!context) {
    throw new Error(
      "useWallet must be used inside WalletProvider"
    );
  }

  return context;
}