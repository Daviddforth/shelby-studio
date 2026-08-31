"use client";

import {
  FolderKanban,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import CollectionHeader from "@/components/collections/CollectionHeader";
import CollectionInformation from "@/components/collections/CollectionInformation";
import CollectionBranding from "@/components/collections/CollectionBranding";
import CollectionPreview from "@/components/collections/CollectionPreview";
import CollectionActions from "@/components/collections/CollectionActions";

import DemoCollectionWorkspace from "@/components/demo/DemoCollectionWorkspace";

import { useWallet } from "@/context/WalletContext";

export default function CollectionsPage() {
  const { walletConnected } = useWallet();

  if (!walletConnected) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-blue-400">
                  Shelby Studio
                </p>

                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-400">
                  <Sparkles size={11} />
                  Demo
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Collection Builder
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Explore how Shelby Studio helps you create
                and organize NFT collections.
              </p>

              <p className="mt-3 text-xs text-slate-600">
                Sample collection data is displayed for
                demonstration. Connect your wallet to create
                and manage your own collections.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400">
                <FolderKanban size={14} />
                Demo Collection
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                <Sparkles size={14} />
                Demo Mode
              </span>
            </div>
          </div>

          <DemoCollectionWorkspace />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <CollectionHeader />

        <div className="grid min-w-0 gap-6 xl:grid-cols-2 xl:gap-8">
          <div className="space-y-8">
            <CollectionInformation />

            <CollectionBranding />

            <CollectionActions />
          </div>

          <div className="space-y-8">
            <CollectionPreview />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
