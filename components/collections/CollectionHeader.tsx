"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  FolderKanban,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

interface ProfileData {
  displayName?: string;
  username?: string;
}

export default function CollectionHeader() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [profileName, setProfileName] =
    useState("");

  const [avatar, setAvatar] =
    useState<string | null>(null);

  /*
   * Load the same profile information
   * already used by Shelby Studio.
   */
  const loadProfile =
    useCallback(() => {
      if (
        !walletConnected ||
        !walletAddress
      ) {
        setProfileName("");
        setAvatar(null);
        return;
      }

      try {
        /*
         * Profile name
         */
        const profileKey =
          `shelby-profile-${walletAddress.toLowerCase()}`;

        const savedProfile =
          localStorage.getItem(
            profileKey
          );

        if (savedProfile) {
          const profile: ProfileData =
            JSON.parse(savedProfile);

          const name =
            profile.displayName?.trim() ||
            profile.username?.trim() ||
            "";

          setProfileName(name);
        } else {
          setProfileName("");
        }

        /*
         * Profile avatar
         *
         * Uses the exact same storage key
         * as AvatarUploader.
         */
        const avatarKey =
          `shelby-profile-avatar-${walletAddress.toLowerCase()}`;

        const savedAvatar =
          localStorage.getItem(
            avatarKey
          );

        setAvatar(savedAvatar);
      } catch (error) {
        console.error(
          "Failed to load Collection Builder profile:",
          error
        );

        setProfileName("");
        setAvatar(null);
      }
    }, [
      walletConnected,
      walletAddress,
    ]);

  /*
   * Load whenever the wallet changes.
   */
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /*
   * Listen for profile edits.
   */
  useEffect(() => {
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
    <div className="border-b border-slate-800 pb-10">
      <div className="flex items-center gap-6">
        {/* Profile Avatar */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {avatar ? (
            <img
              src={avatar}
              alt={
                profileName
                  ? `${profileName} profile`
                  : "Profile avatar"
              }
              className="h-full w-full object-cover"
            />
          ) : (
            <FolderKanban
              size={38}
              className="text-blue-400"
            />
          )}
        </div>

        {/* Header */}
        <div className="min-w-0">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {profileName ? (
              <>
                <span className="text-blue-400">
                  {profileName}&apos;s
                </span>{" "}
                Collection Builder
              </>
            ) : (
              "Collection Builder"
            )}
          </h1>

          <p className="mt-3 text-lg text-slate-400">
            Create and manage NFT collections on Shelby.
          </p>
        </div>
      </div>
    </div>
  );
}