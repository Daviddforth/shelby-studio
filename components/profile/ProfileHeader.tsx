"use client";

import {
  CheckCircle2,
  Wallet,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import AvatarUploader from "./AvatarUploader";

export default function ProfileHeader() {
  const { walletConnected } = useWallet();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

        {/* Avatar */}

        <AvatarUploader />

        {/* Profile Details */}

        <div className="flex-1">
          <p className="uppercase tracking-widest text-blue-400">
            SHELBY STUDIO
          </p>

          <h1 className="mt-2 text-5xl font-bold text-white">
            My Profile
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Manage your Shelbynet account, digital assets,
            storage, NFTs and creator settings.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Shelbynet
            </span>

            {walletConnected ? (
              <span className="flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white">
                <CheckCircle2 size={16} />
                Wallet Connected
              </span>
            ) : (
              <span className="flex items-center gap-2 rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300">
                <Wallet size={16} />
                Wallet Not Connected
              </span>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}