"use client";

import {
  Database,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import StorageStats from "@/components/storage/StorageStats";
import UploadPanel from "@/components/storage/UploadPanel";
import DemoStorageWorkspace from "@/components/demo/DemoStorageWorkspace";

import { useWallet } from "@/context/WalletContext";

export default function StoragePage() {
  const { walletConnected } = useWallet();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-blue-400">
                Shelby Studio
              </p>

              {!walletConnected && (
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-400">
                  <Sparkles size={11} />
                  Demo
                </span>
              )}
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Storage Manager
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {walletConnected
                ? "Manage your assets, upload files, monitor storage usage, and prepare your digital assets for Shelby."
                : "Explore how Shelby Studio manages assets and storage before connecting your wallet."}
            </p>

            {!walletConnected && (
              <p className="mt-3 text-xs text-slate-600">
                Sample storage data is displayed for demonstration.
                Connect your wallet to manage your own files.
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400">
              <Database size={14} />

              {walletConnected
                ? "Storage"
                : "Demo Storage"}
            </span>

            {walletConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 size={14} />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                <Sparkles size={14} />
                Demo Mode
              </span>
            )}
          </div>
        </div>

        {!walletConnected ? (
          <DemoStorageWorkspace />
        ) : (
          <>
            {/* Storage Statistics */}
            <StorageStats />

            {/* Upload */}
            <UploadPanel />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
