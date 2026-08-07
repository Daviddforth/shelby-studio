"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioStats from "@/components/portfolio/PortfolioStats";
import PublishedProjectsGrid from "@/components/portfolio/PublishedProjectsGrid";

import { useWallet } from "@/context/WalletContext";

import {
  Wallet,
  FolderKanban,
} from "lucide-react";

export default function PortfolioPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  if (
    !walletConnected ||
    !walletAddress
  ) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900">
          <div className="text-center">
            <Wallet
              className="mx-auto text-blue-400"
              size={48}
            />

            <h2 className="mt-6 text-3xl font-bold text-white">
              Connect Your Wallet
            </h2>

            <p className="mt-3 max-w-lg text-slate-400">
              Connect your Aptos wallet to
              access your published Shelby
              projects.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <PortfolioHeader />

        <PortfolioStats />

        <section>
          <div className="mb-6 flex items-center gap-3">
            <FolderKanban className="text-blue-400" />

            <h2 className="text-2xl font-bold text-white">
              Published Projects
            </h2>
          </div>

          <PublishedProjectsGrid />
        </section>
      </div>
    </DashboardLayout>
  );
}