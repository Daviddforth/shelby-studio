"use client";

import {
  Search,
  Wallet,
} from "lucide-react";

import { useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ExplorerHeader from "@/components/explorer/ExplorerHeader";
import SearchBar from "@/components/explorer/SearchBar";
import AssetTable from "@/components/explorer/AssetTable";

import { useWallet } from "@/context/WalletContext";

export default function ExplorerPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("newest");

  if (!walletConnected || !walletAddress) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <div className="max-w-lg text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Wallet size={26} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              Connect Your Wallet
            </h2>

            <p className="mt-3 leading-7 text-slate-400">
              Connect your wallet to explore
              published content in Shelby Studio.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-500">
              <Search
                size={14}
                className="text-blue-400"
              />
              Wallet required
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ExplorerHeader />


        <div className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <SearchBar />

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="all">
                All Status
              </option>
              <option value="Stored">
                Stored
              </option>
              <option value="Failed">
                Failed
              </option>
              <option value="Pending">
                Pending
              </option>
            </select>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="newest">
                Newest
              </option>
              <option value="oldest">
                Oldest
              </option>
              <option value="name">
                Name
              </option>
              <option value="largest">
                Largest
              </option>
              <option value="smallest">
                Smallest
              </option>
            </select>
          </div>

          <AssetTable
            status={status}
            sort={sort}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
