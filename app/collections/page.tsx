"use client";

import {
  FolderKanban,
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import CollectionHeader from "@/components/collections/CollectionHeader";
import ActiveProjectBanner from "@/components/collections/ActiveProjectBanner";
import CollectionInformation from "@/components/collections/CollectionInformation";
import CollectionBranding from "@/components/collections/CollectionBranding";
import CollectionMetadata from "@/components/collections/CollectionMetadata";
import CollectionPreview from "@/components/collections/CollectionPreview";
import CollectionActions from "@/components/collections/CollectionActions";

import { useWallet } from "@/context/WalletContext";

export default function CollectionsPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  /*
   * Keep the collection workspace private
   * until a real wallet is connected.
   */
  if (
    !walletConnected ||
    !walletAddress
  ) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <CollectionHeader />

          <div className="flex min-h-[430px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Wallet size={30} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Connect Your Wallet
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Connect your wallet to access the
                Collection Builder and continue working
                with your Shelby Studio projects.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-400">
                <FolderKanban
                  size={16}
                  className="text-blue-400"
                />

                No collection loaded
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Your saved collection workspace will only
                load after the associated wallet is
                connected.
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
        {/* Header */}
        <CollectionHeader />

        {/* Active Project */}
        <ActiveProjectBanner />

        {/* Collection Workspace */}
        <div className="grid gap-8 xl:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            <CollectionInformation />

            <CollectionBranding />

            <CollectionMetadata />

            <CollectionActions />
          </div>

          {/* Right Column */}
          <CollectionPreview />
        </div>
      </div>
    </DashboardLayout>
  );
}
