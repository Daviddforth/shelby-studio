"use client";

import { useState } from "react";
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

export default function AssetTabs() {
  const [activeTab, setActiveTab] = useState("Overview");

  const { walletConnected } = useWallet();

  const { assets } = useStorage();

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
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center">
              <p className="text-sm font-semibold text-white">
                Connect your wallet to use Asset Manager
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your Shelby assets, collections, metadata, and
                storage information will appear here after
                connecting your Aptos wallet.
              </p>

              <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
                <PreviewItem
                  title="Manage Assets"
                  description="Browse, inspect, download, and manage your stored Shelby assets."
                />

                <PreviewItem
                  title="Track Storage"
                  description="View storage usage and files associated with your wallet."
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
                Create, validate, import, and manage your NFT
                metadata from the dedicated Metadata workspace.
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
