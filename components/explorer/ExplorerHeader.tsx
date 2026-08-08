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
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="uppercase tracking-widest text-blue-400">
          Shelby Studio
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Project Explorer
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Browse projects, inspect publication status, and
          explore assets published through Shelby Studio.
        </p>
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
          <p className="text-xs uppercase tracking-wider text-slate-500">
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

          {walletConnected && walletAddress && (
            <p className="mt-1 font-mono text-xs text-slate-500">
              {shortenAddress(walletAddress)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function shortenAddress(address: string) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
