"use client";

import { useEffect, useMemo, useState } from "react";

import { Check, Loader2, Save } from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorage } from "@/hooks/useStorage";

import { signProfileRequest } from "@/lib/profile/clientSign";
import { getMediaType, mediaStreamPath } from "@/lib/media/types";

import {
  BIO_MAX,
  EMPTY_PROFILE,
  NAME_MAX,
  sanitizeProfile,
  type ProfileData,
} from "@/lib/profile/types";

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500";

function storageKey(address: string) {
  return `shelby-profile-${address.toLowerCase()}`;
}

function avatarKey(address: string) {
  return `shelby-profile-avatar-${address.toLowerCase()}`;
}

/** Keeps the top bar and dashboard (which read the browser copy) in step. */
function mirrorLocally(address: string, profile: ProfileData) {
  try {
    localStorage.setItem(storageKey(address), JSON.stringify(profile));

    if (profile.avatarBlob) {
      localStorage.setItem(avatarKey(address), mediaStreamPath(address, profile.avatarBlob));
    }

    window.dispatchEvent(new Event("shelby-profile-updated"));
  } catch {
    // Browser storage can be unavailable; the saved profile is on the server.
  }
}

export default function EditProfile() {
  const { walletConnected, walletAddress, account, signMessage } = useWallet();

  const { assets } = useStorage();

  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);

  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const [error, setError] = useState<string | null>(null);

  const images = useMemo(() => {
    const seen = new Set<string>();

    const result: string[] = [];

    for (const asset of assets) {
      if (asset.status !== "Stored") continue;

      const blobName = asset.blobName || asset.name;

      if (getMediaType(blobName)?.kind === "image" && !seen.has(blobName)) {
        seen.add(blobName);
        result.push(blobName);
      }
    }

    return result;
  }, [assets]);

  // Load the public copy; fall back to what this browser remembered earlier.
  useEffect(() => {
    if (!walletConnected || !walletAddress) return;

    let cancelled = false;

    (async () => {
      let local: Partial<ProfileData> = {};

      try {
        const raw = localStorage.getItem(storageKey(walletAddress));

        if (raw) local = JSON.parse(raw);
      } catch {
        // ignore
      }

      try {
        const response = await fetch(`/api/profile?owner=${encodeURIComponent(walletAddress)}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!cancelled && data?.profile) {
          setProfile({ ...EMPTY_PROFILE, ...data.profile });
          return;
        }
      } catch {
        // offline or no database: use the local copy below
      }

      if (!cancelled) {
        setProfile({
          ...EMPTY_PROFILE,
          displayName: local.displayName ?? "",
          bio: local.bio ?? "",
          website: local.website ?? "",
          twitter: local.twitter ?? "",
          github: local.github ?? "",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [walletConnected, walletAddress]);

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setStatus("idle");
    setError(null);
    setProfile((previous) => ({ ...previous, [key]: value }));
  }

  async function save() {
    if (!walletConnected || !walletAddress) return;

    const cleaned = sanitizeProfile(profile);

    if (!cleaned.ok) {
      setError(cleaned.error);
      return;
    }

    if (!signMessage || !account) {
      setError("Your wallet cannot sign messages. Reconnect it and try again.");
      return;
    }

    setStatus("saving");
    setError(null);

    try {
      const request = await signProfileRequest({
        signMessage,
        account,
        owner: walletAddress,
        profile: cleaned.profile,
      });

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not save your profile.");
      }

      setProfile({ ...EMPTY_PROFILE, ...data.profile });
      mirrorLocally(walletAddress, data.profile);
      setStatus("saved");

      window.setTimeout(() => setStatus("idle"), 2500);
    } catch (caught) {
      setStatus("idle");

      setError(caught instanceof Error ? caught.message : "Could not save your profile.");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div>
        <h2 className="text-base font-semibold text-white">Public profile</h2>

        <p className="mt-1 text-xs text-slate-500">
          Shown to everyone on your creator page. Saving asks your wallet to sign a free message.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Display name</label>

          <input
            value={profile.displayName}
            maxLength={NAME_MAX}
            onChange={(event) => update("displayName", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Website</label>

          <input
            value={profile.website}
            placeholder="https://"
            onChange={(event) => update("website", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">X (Twitter) handle</label>

          <input
            value={profile.twitter}
            placeholder="yourhandle"
            onChange={(event) => update("twitter", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">GitHub username</label>

          <input
            value={profile.github}
            onChange={(event) => update("github", event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Bio <span className="text-slate-600">({profile.bio.length}/{BIO_MAX})</span>
          </label>

          <textarea
            rows={4}
            value={profile.bio}
            maxLength={BIO_MAX}
            onChange={(event) => update("bio", event.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Profile picture</label>

          {images.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-700 p-3 text-xs text-slate-500">
              Upload an image on the Upload page first, then pick it here. Your picture is stored on Shelby.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => update("avatarBlob", null)}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  profile.avatarBlob === null
                    ? "border-blue-500 text-white"
                    : "border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                None
              </button>

              {images.slice(0, 24).map((blobName) => {
                const selected = profile.avatarBlob === blobName;

                return (
                  <button
                    key={blobName}
                    type="button"
                    title={blobName}
                    onClick={() => update("avatarBlob", blobName)}
                    className={`relative h-14 w-14 overflow-hidden rounded-full border-2 ${
                      selected ? "border-blue-500" : "border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaStreamPath(walletAddress ?? "", blobName)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />

                    {selected && (
                      <span className="absolute inset-0 flex items-center justify-center bg-blue-600/40">
                        <Check size={16} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
          {error}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800 pt-5">
        <p className="text-xs text-slate-600">
          X handle is shown as written and is not verified yet.
        </p>

        <button
          type="button"
          onClick={save}
          disabled={status === "saving" || !walletConnected}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
        >
          {status === "saving" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Save profile"}
        </button>
      </div>
    </section>
  );
}
