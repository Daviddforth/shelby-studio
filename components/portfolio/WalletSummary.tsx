"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function WalletSummary() {
  const { account, connected } = useWallet();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-400">
            Wallet
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            {connected ? "Connected" : "Not Connected"}
          </h2>
        </div>

        <div className="text-right">

          <p className="font-mono text-slate-300">
            {connected
              ? `${account?.address.toString().slice(0, 6)}...${account?.address
                  .toString()
                  .slice(-4)}`
              : "--"}
          </p>

          <p className="mt-2 text-blue-400">
            Shelbynet
          </p>

        </div>

      </div>
    </div>
  );
}