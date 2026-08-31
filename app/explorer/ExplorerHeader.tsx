"use client";

import {
  ExternalLink,
  Search,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

export default function ExplorerHeader() {
  const {
    walletAddress,
  } = useWallet();

  function openShelbyExplorer() {
    const url = walletAddress
      ? `https://explorer.shelby.xyz/shelbynet/account/${encodeURIComponent(
          walletAddress
        )}`
      : "https://explorer.shelby.xyz/shelbynet";

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

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
              Browse, search and manage every
              file stored on Shelbynet from one
              workspace.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            openShelbyExplorer
          }
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-400 transition hover:border-blue-500 hover:bg-blue-500/20 hover:text-blue-300"
        >
          <ExternalLink
            size={16}
          />
          Open Shelby Explorer
        </button>
      </div>
    </div>
  );
}
