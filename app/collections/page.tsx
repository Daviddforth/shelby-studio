"use client";

import {
  FolderKanban,
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import CollectionHeader from "@/components/collections/CollectionHeader";
import CollectionInformation from "@/components/collections/CollectionInformation";
import CollectionBranding from "@/components/collections/CollectionBranding";
import CollectionPreview from "@/components/collections/CollectionPreview";
import CollectionActions from "@/components/collections/CollectionActions";

import { useWallet } from "@/context/WalletContext";

export default function CollectionsPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  if (!walletConnected || !walletAddress) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <CollectionHeader />

          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Wallet size={24} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                Connect Your Wallet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Connect your wallet to access the Collection Builder.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-500">
                <FolderKanban
                  size={14}
                  className="text-blue-400"
                />
                No collection loaded
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CollectionHeader />


        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <div className="space-y-6">
            <CollectionInformation />

            <CollectionBranding />


            <CollectionActions />
          </div>

          <CollectionPreview />
        </div>
      </div>
    </DashboardLayout>
  );
}
