"use client";

import {
  FolderKanban,
  Wallet,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

export default function PortfolioHeader() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  return (
    <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
      <div>
        <div className="flex items-center gap-3">
          <FolderKanban className="text-blue-400" />

          <span className="text-blue-400 font-semibold uppercase tracking-wider">
            Published Portfolio
          </span>
        </div>

        <h1 className="mt-4 text-5xl font-bold text-white">
          Shelby Portfolio
        </h1>

        <p className="mt-4 max-w-3xl text-slate-400">
          Browse every project you have
          successfully published through
          Shelby Studio. View publication
          status, storage usage, assets and
          project details.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
        <div className="flex items-center gap-3">
          <Wallet
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

            <p className="font-semibold text-white">
              {walletConnected
                ? "Connected"
                : "Disconnected"}
            </p>

            {walletConnected &&
              walletAddress && (
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {walletAddress.slice(
                    0,
                    8
                  )}
                  ...
                  {walletAddress.slice(-6)}
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}