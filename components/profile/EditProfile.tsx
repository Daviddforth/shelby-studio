"use client";

import {
  useEffect,
  useState,
} from "react";

import { useWallet } from "@/context/WalletContext";

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

export default function EditProfile() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [
    profile,
    setProfile,
  ] = useState<ProfileData>(
    emptyProfile
  );

  /*
   * Every wallet receives its own
   * local Shelby Studio profile.
   */
  function getStorageKey(
    address: string
  ) {
    return `shelby-profile-${address.toLowerCase()}`;
  }

  /*
   * Load only the profile belonging
   * to the currently connected wallet.
   */
  useEffect(() => {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      setProfile(emptyProfile);
      return;
    }

    try {
      const saved =
        localStorage.getItem(
          getStorageKey(walletAddress)
        );

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
        "Failed to load profile:",
        error
      );

      setProfile(emptyProfile);
    }
  }, [
    walletConnected,
    walletAddress,
  ]);

  function update(
    key: keyof ProfileData,
    value: string
  ) {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function saveProfile() {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      return;
    }

    try {
      localStorage.setItem(
        getStorageKey(walletAddress),
        JSON.stringify(profile)
      );

      alert(
        "Profile saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );
    }
  }

  const fields = [
    [
      "Display Name",
      "displayName",
    ],
    [
      "Username",
      "username",
    ],
    [
      "Website",
      "website",
    ],
    [
      "GitHub",
      "github",
    ],
    [
      "Twitter / X",
      "twitter",
    ],
  ] as const;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Edit Profile
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Manage the creator profile associated
        with your connected wallet.
      </p>

      <div className="mt-8 space-y-6">
        {fields.map(
          ([label, key]) => (
            <div key={key}>
              <label className="mb-2 block text-sm text-slate-400">
                {label}
              </label>

              <input
                value={profile[key]}
                onChange={(event) =>
                  update(
                    key,
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>
          )
        )}

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Bio
          </label>

          <textarea
            rows={5}
            value={profile.bio}
            onChange={(event) =>
              update(
                "bio",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none transition focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={saveProfile}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
