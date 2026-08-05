"use client";

import {
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";

import { useWallet } from "@/context/WalletContext";

export default function DashboardPage() {
  const {
    walletConnected,
    walletAddress,
    network,
  } = useWallet();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Dashboard Header */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-blue-400">
                Shelby Studio
              </p>

              <h1 className="mt-2 text-4xl font-bold text-white">
                Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-slate-400">
                {walletConnected
                  ? "Manage your digital assets, metadata, collections and storage from one workspace."
                  : "Connect your wallet to access your Shelby Studio workspace."}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-5 py-4">
              <Wallet
                size={21}
                className={
                  walletConnected
                    ? "text-emerald-400"
                    : "text-slate-500"
                }
              />

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Wallet
                </p>

                <p
                  className={`font-semibold ${
                    walletConnected
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {walletConnected
                    ? "Connected"
                    : "Not Connected"}
                </p>

                {walletConnected &&
                  walletAddress && (
                    <p className="mt-1 font-mono text-xs text-slate-500">
                      {shortenAddress(
                        walletAddress
                      )}
                    </p>
                  )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              Network: {network}
            </span>

            {!walletConnected && (
              <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-400">
                Workspace locked
              </span>
            )}
          </div>
        </div>

        {/* Real Wallet Statistics */}
        <DashboardStats />

        {/* Workspace Tools */}
        <QuickActions />

        {/* Wallet / Workspace Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}

function shortenAddress(
  address: string
) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(
    0,
    6
  )}...${address.slice(-4)}`;
}
