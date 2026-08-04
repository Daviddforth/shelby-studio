"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "shelby-profile";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    displayName: "",
    username: "",
    bio: "",
    website: "",
    github: "",
    twitter: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  function update(
    key: keyof typeof profile,
    value: string
  ) {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function saveProfile() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profile)
    );

    alert("Profile saved successfully.");
  }

  const fields = [
    ["Display Name", "displayName"],
    ["Username", "username"],
    ["Website", "website"],
    ["GitHub", "github"],
    ["Twitter / X", "twitter"],
  ] as const;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Edit Profile
      </h2>

      <div className="mt-8 space-y-6">
        {fields.map(([label, key]) => (
          <div key={key}>
            <label className="mb-2 block text-sm text-slate-400">
              {label}
            </label>

            <input
              value={profile[key]}
              onChange={(e) =>
                update(key, e.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Bio
          </label>

          <textarea
            rows={5}
            value={profile.bio}
            onChange={(e) =>
              update("bio", e.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={saveProfile}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}