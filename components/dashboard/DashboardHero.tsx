"use client";

import Link from "next/link";
import {
  Upload,
  FolderPlus,
  Search,
  Wallet,
  CheckCircle2,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";

export default function DashboardHero() {
  const {
    walletConnected,
    walletAddress,
    network,
  } = useWallet();

  const { assets } = useStorageContext();

  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-10">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="uppercase tracking-widest text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-2 text-5xl font-bold text-white">
            Welcome back 👋
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Build, manage and publish digital assets on Shelby from one workspace.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              {network}
            </span>

            {walletConnected ? (
              <span className="flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm text-white">
                <CheckCircle2 size={16} />
                Wallet Connected
              </span>
            ) : (
              <span className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                <Wallet size={16} />
                Wallet Not Connected
              </span>
            )}

            <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
              {assets.length} Assets Stored
            </span>

          </div>

          {walletConnected && walletAddress && (
            <p className="mt-4 font-mono text-sm text-slate-500">
              {walletAddress}
            </p>
          )}

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <Link
            href="/storage"
            className="flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-5 text-white transition hover:bg-blue-700"
          >
            <Upload size={22} />
            Upload Asset
          </Link>

          <Link
            href="/collections"
            className="flex items-center gap-3 rounded-2xl bg-slate-800 px-6 py-5 text-white transition hover:bg-slate-700"
          >
            <FolderPlus size={22} />
            Create Collection
          </Link>

          <Link
            href="/metadata"
            className="flex items-center gap-3 rounded-2xl bg-slate-800 px-6 py-5 text-white transition hover:bg-slate-700"
          >
            Generate Metadata
          </Link>

          <Link
            href="/explorer"
            className="flex items-center gap-3 rounded-2xl bg-slate-800 px-6 py-5 text-white transition hover:bg-slate-700"
          >
            <Search size={22} />
            Asset Explorer
          </Link>

        </div>

      </div>

    </div>
  );
}