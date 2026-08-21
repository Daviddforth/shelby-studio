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
    <div className="mb-6 flex min-w-0 flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
          Shelby Studio
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Asset Explorer
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Explore your stored assets and storage activity,
          storage usage, and Shelby network activity from one place.
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
        <Wallet
          size={18}
          className={
            walletConnected
              ? "text-emerald-400"
              : "text-slate-500"
          }
        />

        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Wallet
          </p>

          <p
            className={`text-sm font-medium ${
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
            <p className="mt-0.5 font-mono text-[11px] text-slate-500">
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
