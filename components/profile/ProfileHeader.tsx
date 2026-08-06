"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Wallet,
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
    if (
      !walletConnected ||
      !walletAddress
    ) {
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

      const parsed =
        JSON.parse(saved);

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
  }, [
    walletConnected,
    walletAddress,
  ]);

  const displayName =
    profile.displayName.trim() ||
    profile.username.trim() ||
    "My Profile";

  const username =
    profile.username.trim();

  const bio =
    profile.bio.trim();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        {/* Avatar */}
        <AvatarUploader />

        {/* Profile Details */}
        <div className="flex-1">
          <p className="uppercase tracking-widest text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-2 text-5xl font-bold text-white">
            {displayName}
          </h1>

          {username && (
            <p className="mt-2 text-lg text-blue-400">
              @{username.replace(
                /^@/,
                ""
              )}
            </p>
          )}

          {bio ? (
            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              {bio}
            </p>
          ) : (
            <p className="mt-4 max-w-2xl text-slate-400">
              Your Shelby Studio creator profile.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              {network}
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
