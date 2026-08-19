"use client";

import { Search, Wallet } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ExplorerHeader from "@/components/explorer/ExplorerHeader";
import { useWallet } from "@/context/WalletContext";

export default function ExplorerPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  if (!walletConnected || !walletAddress) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="max-w-lg text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Wallet size={26} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              Connect Your Wallet
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Connect your wallet to explore
              published content in Shelby Studio.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-500">
              <Search
                size={14}
                className="text-blue-400"
              />
              Wallet required
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

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
          <Search
            size={32}
            className="mx-auto text-blue-400"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            Explorer
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Published Shelby assets, metadata, and
            collections will appear here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
