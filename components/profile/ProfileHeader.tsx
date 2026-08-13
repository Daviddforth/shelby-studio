"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Wallet,
  UserRound,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import AvatarUploader from "./AvatarUploader";

interface ProfileData {
  displayName: string;
  username: string;
  bio: string;
  website: string;
  github: string;
  twitter: string;
}

const emptyProfile: ProfileData = {
  displayName: "",
  username: "",
  bio: "",
  website: "",
  github: "",
  twitter: "",
};

export default function ProfileHeader() {
  const {
    walletConnected,
    walletAddress,
    network,
  } = useWallet();

  const [profile, setProfile] =
    useState<ProfileData>(emptyProfile);

  function loadProfile() {
    if (!walletConnected || !walletAddress) {
      setProfile(emptyProfile);
      return;
    }

    try {
      const storageKey =
        `shelby-profile-${walletAddress.toLowerCase()}`;

      const saved =
        localStorage.getItem(storageKey);

      if (!saved) {
        setProfile(emptyProfile);
        return;
      }

      const parsed = JSON.parse(saved);

      setProfile({
        ...emptyProfile,
        ...parsed,
      });
    } catch (error) {
      console.error(
        "Failed to load profile header:",
        error
      );

      setProfile(emptyProfile);
    }
  }

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
  }, [walletConnected, walletAddress]);

  const displayName =
    profile.displayName.trim() ||
    profile.username.trim() ||
    "My Profile";

  const username =
    profile.username.trim();

  const bio =
    profile.bio.trim();

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-7">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="shrink-0">
          <AvatarUploader />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <UserRound size={14} />
            Creator Profile
          </div>

          <h1 className="mt-2 truncate text-3xl font-bold tracking-tight text-white">
            {displayName}
          </h1>

          {username && (
            <p className="mt-1 text-sm text-blue-400">
              @{username.replace(/^@/, "")}
            </p>
          )}

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            {bio ||
              "Manage your Shelby Studio creator profile and wallet-linked workspace."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
              {network}
            </span>

            {walletConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                <CheckCircle2 size={13} />
                Wallet Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-500">
                <Wallet size={13} />
                Wallet Not Connected
              </span>
            )}

            {walletConnected && walletAddress && (
              <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-[10px] text-slate-500">
                {walletAddress.slice(0, 8)}...
                {walletAddress.slice(-6)}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
