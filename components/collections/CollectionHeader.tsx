"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { FolderKanban } from "lucide-react";
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

  const [profileName, setProfileName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const loadProfile = useCallback(() => {
    if (!walletConnected || !walletAddress) {
      setProfileName("");
      setAvatar(null);
      return;
    }

    try {
      const profileKey =
        `shelby-profile-${walletAddress.toLowerCase()}`;

      const savedProfile =
        localStorage.getItem(profileKey);

      if (savedProfile) {
        const profile: ProfileData =
          JSON.parse(savedProfile);

        setProfileName(
          profile.displayName?.trim() ||
          profile.username?.trim() ||
          ""
        );
      } else {
        setProfileName("");
      }

      const avatarKey =
        `shelby-profile-avatar-${walletAddress.toLowerCase()}`;

      setAvatar(localStorage.getItem(avatarKey));
    } catch (error) {
      console.error(
        "Failed to load Collection Builder profile:",
        error
      );

      setProfileName("");
      setAvatar(null);
    }
  }, [walletConnected, walletAddress]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
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
    <div className="border-b border-slate-800 pb-7">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
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
              size={22}
              className="text-blue-400"
            />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
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

          <p className="mt-2 text-sm text-slate-400">
            Create and manage NFT collections on Shelby.
          </p>
        </div>
      </div>
    </div>
  );
}
