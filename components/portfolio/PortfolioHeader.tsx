"use client";

import { RefreshCcw, Wallet } from "lucide-react";

export default function PortfolioHeader() {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 lg:flex-row lg:items-center">

      <div>
        <p className="text-sm uppercase tracking-widest text-blue-400">
          Portfolio
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Your Digital Assets
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          View and manage every NFT connected to your Shelby wallet.
          Browse collections, inspect metadata, and prepare assets for
          Shelby Storage.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">

        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
          <Wallet size={22} className="text-blue-400" />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Wallet
            </p>

            <p className="font-semibold text-white">
              Connected
            </p>
          </div>
        </div>

        <button className="flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700">
          <RefreshCcw size={18} />

          Refresh
        </button>

      </div>

    </div>
  );
}