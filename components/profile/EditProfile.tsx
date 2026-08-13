"use client";

import {
  useEffect,
  useState,
} from "react";

import { Save } from "lucide-react";

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

  const [profile, setProfile] =
    useState<ProfileData>(emptyProfile);

  const [saved, setSaved] =
    useState(false);

  function getStorageKey(address: string) {
    return `shelby-profile-${address.toLowerCase()}`;
  }

  useEffect(() => {
    if (!walletConnected || !walletAddress) {
      setProfile(emptyProfile);
      return;
    }

    try {
      const savedProfile =
        localStorage.getItem(
          getStorageKey(walletAddress)
        );

      if (!savedProfile) {
        setProfile(emptyProfile);
        return;
      }

      setProfile({
        ...emptyProfile,
        ...JSON.parse(savedProfile),
      });
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );

      setProfile(emptyProfile);
    }
  }, [walletConnected, walletAddress]);

  function update(
    key: keyof ProfileData,
    value: string
  ) {
    setSaved(false);

    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function saveProfile() {
    if (!walletConnected || !walletAddress) {
      return;
    }

    try {
      localStorage.setItem(
        getStorageKey(walletAddress),
        JSON.stringify(profile)
      );

      window.dispatchEvent(
        new Event("shelby-profile-updated")
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );
    }
  }

  const fields = [
    ["Display Name", "displayName"],
    ["Username", "username"],
    ["Website", "website"],
    ["GitHub", "github"],
    ["Twitter / X", "twitter"],
  ] as const;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div>
        <h2 className="text-base font-semibold text-white">
          Edit Profile
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Update the creator information connected to this wallet.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map(([label, key]) => (
          <div key={key}>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
            />
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Bio
          </label>

          <textarea
            rows={4}
            value={profile.bio}
            onChange={(event) =>
              update(
                "bio",
                event.target.value
              )
            }
            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800 pt-5">
        <p className="text-xs text-slate-600">
          Profile data is stored for this wallet.
        </p>

        <button
          type="button"
          onClick={saveProfile}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          <Save size={15} />
          {saved ? "Saved" : "Save Profile"}
        </button>
      </div>
    </section>
  );
}
