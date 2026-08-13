"use client";

import {
  FolderKanban,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

export default function PortfolioHeader() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <FolderKanban size={15} />
            Published Portfolio
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Your Shelby projects, in one place.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            View the projects you have published through Shelby Studio,
            along with their assets, storage usage and publication details.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5">
              <ArrowUpRight size={13} className="text-blue-400" />
              Published on Shelby
            </span>

            <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5">
              Wallet-specific portfolio
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              walletConnected
                ? "bg-emerald-500/10"
                : "bg-slate-800"
            }`}
          >
            <Wallet
              size={17}
              className={
                walletConnected
                  ? "text-emerald-400"
                  : "text-slate-500"
              }
            />
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Wallet
            </p>

            <p className="text-sm font-medium text-white">
              {walletConnected ? "Connected" : "Disconnected"}
            </p>

            {walletConnected && walletAddress && (
              <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                {walletAddress.slice(0, 8)}...
                {walletAddress.slice(-6)}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
