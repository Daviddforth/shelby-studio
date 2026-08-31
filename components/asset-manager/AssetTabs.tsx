"use client";

import { useMemo, useState } from "react";
import {
  Database,
  Files,
  HardDrive,
} from "lucide-react";

import { useStorage } from "@/hooks/useStorage";
import { useWallet } from "@/context/WalletContext";

import AssetList from "./AssetList";
import AssetHistory from "./AssetHistory";

const tabs = [
  "Overview",
  "Assets",
  "Metadata",
  "History",
];

function formatStorage(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export default function AssetTabs() {
  const [activeTab, setActiveTab] =
    useState("Overview");

  const { walletConnected } = useWallet();

  const { assets } = useStorage();

  const storageUsed = useMemo(() => {
    return assets.reduce(
      (total, asset) => total + (asset.size || 0),
      0
    );
  }, [assets]);

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
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
          walletConnected ? (
            <div className="space-y-6">
              {/* Overview information */}
              <div className="grid gap-4 md:grid-cols-2">
                <Info
                  label="Owner"
                  value="Connected Wallet"
                />

                <Info
                  label="Network"
                  value="Shelbynet"
                />

                <Info
                  label="Storage"
                  value="Shelby Ready"
                />

                <Info
                  label="Verification"
                  value="Verified"
                />

                <Info
                  label="Assets"
                  value={`${assets.length}`}
                />

                <Info
                  label="Status"
                  value="Connected"
                />
              </div>

              {/* Storage usage */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                      <HardDrive
                        size={19}
                        className="text-blue-400"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Storage Used
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Total size of assets currently
                        returned for this wallet.
                      </p>
                    </div>
                  </div>

                  <p className="text-xl font-bold text-white sm:text-right">
                    {formatStorage(storageUsed)}
                  </p>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width:
                        storageUsed > 0
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>

                <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {assets.length}{" "}
                    {assets.length === 1
                      ? "asset"
                      : "assets"}
                  </span>

                  <span>
                    Current stored data
                  </span>
                </div>
              </div>

              {/* Storage explanation */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-start gap-3">
                  <Database
                    size={17}
                    className="mt-0.5 shrink-0 text-slate-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      Storage information
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      This value represents the combined
                      size of the assets currently available
                      to this wallet. It is not an account
                      quota or maximum storage limit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center">
              <p className="text-sm font-semibold text-white">
                Connect your wallet to use Asset Manager
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your Shelby assets, collections, metadata,
                and storage information will appear here
                after connecting your Aptos wallet.
              </p>

              <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
                <PreviewItem
                  title="Manage Assets"
                  description="Browse, inspect, download, and manage your stored Shelby assets."
                />

                <PreviewItem
                  title="Track Storage"
                  description="View the current total size of files associated with your wallet."
                />

                <PreviewItem
                  title="Verify Data"
                  description="Inspect asset details, metadata, and Shelby storage information."
                />
              </div>
            </div>
          )
        )}

        {activeTab === "Assets" && (
          walletConnected ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Stored Assets
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage files already stored on Shelby.
                </p>
              </div>

              <AssetList assets={assets} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
                <span className="text-lg text-slate-500">
                  +
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold text-white">
                Connect your wallet to view your assets
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Connect your Aptos wallet to view files
                associated with your Shelby account.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-slate-800 px-3 py-1.5">
                  View
                </span>

                <span className="rounded-full border border-slate-800 px-3 py-1.5">
                  Download
                </span>

                <span className="rounded-full border border-slate-800 px-3 py-1.5">
                  Replace
                </span>

                <span className="rounded-full border border-slate-800 px-3 py-1.5">
                  Delete
                </span>
              </div>
            </div>
          )
        )}

        {activeTab === "Metadata" && (
          walletConnected ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900">
                <span className="text-lg text-slate-400">
                  ✦
                </span>
              </div>

              <h2 className="mt-4 text-lg font-semibold text-white">
                Metadata Workspace
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create, validate, import, and manage your
                NFT metadata from the dedicated Metadata
                workspace.
              </p>

              <a
                href="/metadata"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Open Metadata
              </a>

              <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
                <PreviewItem
                  title="Create"
                  description="Build structured NFT metadata and attributes."
                />

                <PreviewItem
                  title="Validate"
                  description="Check metadata fields before exporting."
                />

                <PreviewItem
                  title="Export"
                  description="Generate metadata JSON for your workflow."
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center">
              <p className="text-sm font-semibold text-white">
                Metadata workspace
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Connect your wallet to create and manage your
                wallet metadata.
              </p>
            </div>
          )
        )}

        {activeTab === "History" && (
          <AssetHistory />
        )}
      </div>
    </div>
  );
}

function PreviewItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-sm font-medium text-white">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
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
