"use client";

import { FileJson, Wallet } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import MetadataHeader from "@/components/metadata/MetadataHeader";
import ActiveProjectBanner from "@/components/metadata/ActiveProjectBanner";
import MetadataTemplates from "@/components/metadata/MetadataTemplates";
import NFTInformation from "@/components/metadata/NFTInformation";
import AttributeBuilder from "@/components/metadata/AttributeBuilder";
import ImportMetadata from "@/components/metadata/ImportMetadata";
import MetadataActions from "@/components/metadata/MetadataActions";
import NFTPreview from "@/components/metadata/NFTPreview";
import JsonPreview from "@/components/metadata/JsonPreview";
import MetadataValidation from "@/components/metadata/MetadataValidation";

import { useWallet } from "@/context/WalletContext";

export default function MetadataPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  /*
   * Do not expose metadata workspace data
   * until a real wallet is connected.
   */
  if (!walletConnected || !walletAddress) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <MetadataHeader />

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
                Metadata Builder and continue working
                with your project metadata.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-400">
                <FileJson
                  size={16}
                  className="text-blue-400"
                />

                No metadata loaded
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Your saved workspace will only be loaded
                after the associated wallet is connected.
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
        <MetadataHeader />

        {/* Active Project */}
        <ActiveProjectBanner />

        {/* Templates */}
        <MetadataTemplates />

        {/* Main Content */}
        <div className="grid gap-8 xl:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            <NFTInformation />

            <AttributeBuilder />

            <ImportMetadata />

            <MetadataActions />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <NFTPreview />

            <JsonPreview />

            <MetadataValidation />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}