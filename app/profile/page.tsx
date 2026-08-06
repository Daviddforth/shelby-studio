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

  if (
    !walletConnected ||
    !walletAddress
  ) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <ProfileHeader />

          <div className="flex min-h-[430px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Wallet size={30} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Connect Your Wallet
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Connect your wallet to access your
                Shelby Studio profile and wallet-linked
                workspace information.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-400">
                <UserRound
                  size={16}
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
      <div className="space-y-8">
        <ProfileHeader />

        <ProfileStats />

        <div className="grid gap-8 xl:grid-cols-3">
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
