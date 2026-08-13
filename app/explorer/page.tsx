"use client";

import { useState } from "react";
import {
  Search,
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ExplorerHeader from "@/components/explorer/ExplorerHeader";
import ExplorerFilters from "@/components/explorer/ExplorerFilters";
import PublishedProjectsGrid from "@/components/explorer/PublishedProjectsGrid";

import { useProject } from "@/context/project/ProjectContext";
import { useWallet } from "@/context/WalletContext";

export default function ExplorerPage() {
  const { projects } = useProject();

  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("newest");

  const [search, setSearch] =
    useState("");

  if (
    !walletConnected ||
    !walletAddress
  ) {
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
              projects and publication activity
              in Shelby Studio.
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

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search projects, descriptions, or owners..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <ExplorerFilters
          status={status}
          setStatus={setStatus}
          sort={sort}
          setSort={setSort}
        />

        <PublishedProjectsGrid
          projects={projects}
          search={search}
          status={status}
          sort={sort}
        />
      </div>
    </DashboardLayout>
  );
}
