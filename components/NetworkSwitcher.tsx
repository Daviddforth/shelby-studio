"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

export default function NetworkSwitcher() {
  const { connected, network } = useWallet();

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Shelby Network
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Blockchain environment
      </p>

      <div className="mt-6 space-y-4 rounded-xl border p-4">

        <div className="flex justify-between">
          <span>Wallet</span>

          <span
            className={
              connected
                ? "font-medium text-green-600"
                : "font-medium text-red-500"
            }
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Current Network</span>

          <span className="font-semibold text-blue-600">
            {network?.name ?? Network.SHELBYNET}
          </span>
        </div>

      </div>
    </div>
  );
}