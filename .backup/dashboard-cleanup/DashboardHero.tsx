"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Wallet } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

export default function DashboardHero() {
  const {
    walletConnected,
    walletAddress,
    network,
  } = useWallet();

  const [profileName, setProfileName] =
    useState("");

  const [assetCount, setAssetCount] =
    useState(0);

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

  useEffect(() => {
    if (!walletConnected || !walletAddress) {
      setAssetCount(0);
      return;
    }

    let cancelled = false;
    const address = walletAddress;

    async function loadAssetCount() {
      try {
        const response = await fetch(
          `/api/shelby/assets?walletAddress=${encodeURIComponent(
            address
          )}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!cancelled && response.ok && result.success) {
          setAssetCount(
            Number(result.count) || 0
          );
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard asset count:",
          error
        );
      }
    }

    void loadAssetCount();

    return () => {
      cancelled = true;
    };
  }, [walletConnected, walletAddress]);

  return (
    <section className="border-b border-slate-800 pb-7">
      <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
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
            <p className="mt-3 truncate font-mono text-xs text-slate-600">
              {walletAddress}
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
            <span className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400">
              <Wallet size={14} />
              Wallet Not Connected
            </span>
          )}

          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400">
            {assetCount}{" "}
            {assetCount === 1
              ? "asset"
              : "assets"}
          </span>
        </div>
      </div>
    </section>
  );
}
