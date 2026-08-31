"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Sparkles,
  Wallet,
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

  const [profileName, setProfileName] = useState("");

  const loadProfile = useCallback(() => {
    if (!walletConnected || !walletAddress) {
      setProfileName("");
      return;
    }

    try {
      const storageKey =
        `shelby-profile-${walletAddress.toLowerCase()}`;

      const savedProfile =
        localStorage.getItem(storageKey);

      if (!savedProfile) {
        setProfileName("");
        return;
      }

      const profile = JSON.parse(savedProfile);

      setProfileName(
        profile.displayName?.trim() ||
          profile.username?.trim() ||
          ""
      );
    } catch (error) {
      console.error(
        "Failed to load dashboard profile:",
        error
      );

      setProfileName("");
    }
  }, [walletConnected, walletAddress]);

  useEffect(() => {
    loadProfile();

    function handleProfileUpdate() {
      loadProfile();
    }

    window.addEventListener(
      "shelby-profile-updated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "shelby-profile-updated",
        handleProfileUpdate
      );
    };
  }, [loadProfile]);

  return (
    <section className="border-b border-slate-800 pb-7">
      <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-blue-400">
              Shelby Studio
            </p>

            {!walletConnected && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                <Sparkles size={11} />
                Demo
              </span>
            )}
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {walletConnected
              ? profileName
                ? `Welcome back, ${profileName}`
                : "Welcome back"
              : "Explore Shelby Studio"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {walletConnected
              ? "Manage your assets, storage, metadata, and development workflow from one workspace."
              : "Explore the Shelby Studio workspace and discover how assets, storage, collections, and metadata work together."}
          </p>

          {walletConnected && walletAddress && (
            <p className="mt-3 truncate font-mono text-xs text-slate-600">
              {walletAddress}
            </p>
          )}

          {!walletConnected && (
            <p className="mt-3 text-xs text-slate-600">
              Sample data is displayed for demonstration.
              Connect your wallet to use your own workspace.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
            {network}
          </span>

          {walletConnected ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <CheckCircle2 size={14} />
              Wallet Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
              <Sparkles size={14} />
              Demo Mode
            </span>
          )}

          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400">
            {walletConnected
              ? `${assets.length} ${
                  assets.length === 1
                    ? "asset"
                    : "assets"
                }`
              : "3 demo assets"}
          </span>
        </div>
      </div>
    </section>
  );
}
