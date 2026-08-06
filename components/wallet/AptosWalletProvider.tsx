"use client";

import { ReactNode } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

export default function AptosWalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AptosWalletAdapterProvider
      dappConfig={{
        network: Network.SHELBYNET,
        aptosApiKeys: {
          shelbynet: process.env.NEXT_PUBLIC_APTOS_API_KEY!,
        },
      }}
      onError={(error: Error) => {
        console.error(
          "SHELBY WALLET ADAPTER ERROR:",
          error
        );
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}