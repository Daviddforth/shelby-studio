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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    assets,
    upload,
    loading,
    progress,
  } = useStorage();

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`min-w-fit px-4 py-4 text-sm font-semibold transition sm:px-6 ${
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
      <div className="min-w-0 p-4 sm:p-6">
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
              disabled={loading}
              onSelect={async (file) => {
                setUploadError(null);

                try {
                  await upload(file);
                } catch (error) {
                  setUploadError(
                    error instanceof Error
                      ? error.message
                      : "Failed to upload asset."
                  );
                }
              }}
            />

            {loading && progress && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      Uploading to Shelby
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {progress.phase}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-blue-400">
                    {Math.round(progress.percentage)}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, progress.percentage)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <div
                role="alert"
                className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300"
              >
                {uploadError}
              </div>
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