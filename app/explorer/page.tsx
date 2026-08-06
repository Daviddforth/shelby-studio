"use client";

import { useState } from "react";

import {
  Search,
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import ExplorerHeader from "@/components/explorer/ExplorerHeader";
import SearchBar from "@/components/explorer/SearchBar";
import ExplorerFilters from "@/components/explorer/ExplorerFilters";
import AssetTable from "@/components/explorer/AssetTable";

import { useWallet } from "@/context/WalletContext";

export default function ExplorerPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  /*
   * Explorer filter state.
   */
  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("newest");

  /*
   * Explorer must never expose stored
   * workspace data without a wallet.
   */
  if (
    !walletConnected ||
    !walletAddress
  ) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <ExplorerHeader />

          <div className="flex min-h-[430px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Wallet size={30} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Connect Your Wallet
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Connect your wallet to browse and manage
                assets associated with your Shelby Studio
                workspace.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-400">
                <Search
                  size={16}
                  className="text-blue-400"
                />

                No assets loaded
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Asset data remains hidden until the
                associated wallet is connected.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ExplorerHeader />

        <SearchBar />

        <ExplorerFilters
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
        />

        <AssetTable
          status={status}
          sort={sort}
        />
      </div>
    </DashboardLayout>
  );
}
