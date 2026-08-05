"use client";

import {
  Search,
  Wallet,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

export default function ExplorerHeader() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-600 p-4">
            <Search
              size={28}
              className="text-white"
            />
          </div>

          <div>
            <p className="uppercase tracking-widest text-blue-400">
              Shelby Studio
            </p>

            <h1 className="mt-1 text-4xl font-bold text-white">
              Asset Explorer
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              {walletConnected
                ? "Browse, search and manage the assets available in your Shelby Studio workspace."
                : "Connect your wallet to browse and manage your Shelby Studio assets."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <Wallet
            size={21}
            className={
              walletConnected
                ? "text-emerald-400"
                : "text-slate-500"
            }
          />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Wallet
            </p>

            <p
              className={`font-semibold ${
                walletConnected
                  ? "text-emerald-400"
                  : "text-slate-400"
              }`}
            >
              {walletConnected
                ? "Connected"
                : "Not Connected"}
            </p>

            {walletConnected &&
              walletAddress && (
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {shortenAddress(
                    walletAddress
                  )}
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

function shortenAddress(
  address: string
) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(
    0,
    6
  )}...${address.slice(-4)}`;
}
