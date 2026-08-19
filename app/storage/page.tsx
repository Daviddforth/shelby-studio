"use client";

import {
  Database,
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import StorageStats from "@/components/storage/StorageStats";
import UploadPanel from "@/components/storage/UploadPanel";
import RecentFiles from "@/components/storage/RecentFiles";

import { useWallet } from "@/context/WalletContext";

export default function StoragePage() {
  const {
    walletConnected,
  } = useWallet();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <p className="uppercase tracking-widest text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Storage Manager
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Manage your assets and upload new files,
            monitor storage usage, and prepare your
            digital assets for Shelby.
          </p>
        </div>

        {!walletConnected ? (
          /*
           * Disconnected state.
           *
           * Do not render workspace-specific storage,
           * previous files, statistics or
           * upload controls.
           */
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">
                <Wallet
                  size={28}
                  className="text-blue-400"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Connect Your Wallet
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Connect your wallet to access your
                Shelby Studio storage workspace and
                continue managing your stored assets.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-500">
                <Database size={15} />

                Storage is wallet-specific
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Storage Statistics */}
            <StorageStats />

            {/* Upload */}
            <UploadPanel />

            {/* Files */}
            <RecentFiles />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
