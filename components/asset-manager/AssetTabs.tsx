"use client";

import { useState } from "react";
import { useStorage } from "@/hooks/useStorage";

import AssetUploader from "./AssetUploader";
import AssetList from "./AssetList";
import AssetHistory from "./AssetHistory";

const tabs = [
  "Overview",
  "Assets",
  "Metadata",
  "History",
];

export default function AssetTabs() {
  const [activeTab, setActiveTab] = useState("Overview");

  const {
    assets,
    upload,
    loading,
  } = useStorage();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-semibold transition ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "Overview" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Collection" value="Genesis Collection" />
            <Info label="Owner" value="Connected Wallet" />
            <Info label="Network" value="Shelbynet" />
            <Info label="Storage" value="Shelby Ready" />
            <Info label="Verification" value="Verified" />
            <Info label="Standard" value="Shelby Digital Asset" />
          </div>
        )}

        {activeTab === "Assets" && (
          <div className="space-y-8">
            <AssetUploader
              onSelect={async (file) => {
                await upload(file);
              }}
            />

            {loading && (
              <p className="text-blue-400">
                Uploading to Shelbynet...
              </p>
            )}

            <div>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Stored Assets
              </h2>

              <AssetList assets={assets} />
            </div>
          </div>
        )}

        {activeTab === "Metadata" && (
          <pre className="overflow-auto rounded-xl bg-slate-950 p-5 text-sm text-green-400">
{`{
  "name": "Genesis NFT",
  "description": "Stored securely on Shelbynet",
  "collection": "Genesis Collection",
  "image": "cover.png",
  "attributes": []
}`}
          </pre>
        )}

        {activeTab === "History" && (
          <AssetHistory />
        )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}