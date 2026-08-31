"use client";

import { FileJson, Wallet } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import MetadataHeader from "@/components/metadata/MetadataHeader";
import MetadataTemplates from "@/components/metadata/MetadataTemplates";
import NFTInformation from "@/components/metadata/NFTInformation";
import AttributeBuilder from "@/components/metadata/AttributeBuilder";
import ImportMetadata from "@/components/metadata/ImportMetadata";
import MetadataActions from "@/components/metadata/MetadataActions";
import NFTPreview from "@/components/metadata/NFTPreview";
import JsonPreview from "@/components/metadata/JsonPreview";
import MetadataValidation from "@/components/metadata/MetadataValidation";
import DemoMetadataWorkspace from "@/components/demo/DemoMetadataWorkspace";

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

          <DemoMetadataWorkspace />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <MetadataHeader />

        {/* Templates */}
        <MetadataTemplates />

        {/* Main Content */}
        <div className="grid min-w-0 gap-6 xl:grid-cols-2 xl:gap-8">
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