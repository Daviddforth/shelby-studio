"use client";

import {
  Images,
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioStats from "@/components/portfolio/PortfolioStats";
import PortfolioFilters from "@/components/portfolio/PortfolioFilters";
import NFTGrid from "@/components/portfolio/NFTGrid";

import { useWallet } from "@/context/WalletContext";

export default function PortfolioPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  /*
   * Never expose portfolio data until
   * a real wallet is connected.
   */
  if (
    !walletConnected ||
    !walletAddress
  ) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <PortfolioHeader />

          <div className="flex min-h-[430px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Wallet size={30} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Connect Your Wallet
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Connect your wallet to view the NFTs and
                digital assets associated with your account.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-400">
                <Images
                  size={16}
                  className="text-blue-400"
                />

                No portfolio loaded
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Shelby Studio does not display portfolio
                information while your wallet is disconnected.
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
        <PortfolioHeader />

        <PortfolioStats />

        <PortfolioFilters />

        <NFTGrid />
      </div>
    </DashboardLayout>
  );
}
