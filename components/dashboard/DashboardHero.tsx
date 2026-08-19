"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Wallet } from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";

export default function DashboardHero() {
  const { walletConnected, walletAddress, network } = useWallet();
  const { assets } = useStorageContext();

  const [profileName, setProfileName] = useState("");

  const loadProfile = useCallback(() => {
    if (!walletConnected || !walletAddress) {
      setProfileName("");
      return;
    }

    try {
      const storageKey = `shelby-profile-${walletAddress.toLowerCase()}`;
      const savedProfile = localStorage.getItem(storageKey);

      if (!savedProfile) {
        setProfileName("");
        return;
      }

      const profile = JSON.parse(savedProfile);

      const name =
        profile.displayName?.trim() ||
        profile.username?.trim() ||
        "";

      setProfileName(name);
    } catch (error) {
      console.error("Failed to load dashboard profile:", error);
      setProfileName("");
    }
  }, [walletConnected, walletAddress]);

  useEffect(() => {
    loadProfile();

    window.addEventListener(
      "shelby-profile-updated",
      loadProfile
    );

    return () => {
      window.removeEventListener(
        "shelby-profile-updated",
        loadProfile
      );
    };
  }, [loadProfile]);

  return (
    <section className="border-b border-slate-800 pb-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {walletConnected
              ? profileName
                ? `Welcome back, ${profileName}`
                : "Welcome back"
              : "Welcome to Shelby Studio"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Manage your assets, storage, metadata, and development
            workflow from one workspace.
          </p>

          {walletConnected && walletAddress && (
            <p className="mt-3 font-mono text-xs text-slate-600">
              {walletAddress}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
            {network}
          </span>

          {walletConnected ? (
            <span className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
              <CheckCircle2 size={14} />
              Wallet Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400">
              <Wallet size={14} />
              Wallet Not Connected
            </span>
          )}

          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400">
            {assets.length} {assets.length === 1 ? "asset" : "assets"}
          </span>
        </div>
      </div>
    </section>
  );
}
