"use client";

import {
  UserRound,
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import EditProfile from "@/components/profile/EditProfile";
import ProfileWallet from "@/components/profile/ProfileWallet";
import ProfileActivity from "@/components/profile/ProfileActivity";

import { useWallet } from "@/context/WalletContext";

export default function ProfilePage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  if (!walletConnected || !walletAddress) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <ProfileHeader />

          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <Wallet
                  size={22}
                  className="text-blue-400"
                />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                Connect Your Wallet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Connect your wallet to access your Shelby Studio
                profile and wallet-linked workspace information.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-500">
                <UserRound
                  size={14}
                  className="text-blue-400"
                />
                No profile loaded
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProfileHeader />

        <ProfileStats />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <EditProfile />
          </div>

          <ProfileWallet />
        </div>

        <ProfileActivity />
      </div>
    </DashboardLayout>
  );
}
