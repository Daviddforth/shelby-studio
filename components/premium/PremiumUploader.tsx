"use client";

import { useState } from "react";

import { Loader2, Lock } from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorage } from "@/hooks/useStorage";

import { postJson, signAction } from "@/lib/actionsClient";
import { encryptBytes, generateFileKey } from "@/lib/premium/crypto";
import { PREMIUM_MAX_BYTES, premiumSetFields } from "@/lib/premium/types";
import { aptToOctas } from "@/lib/social/types";
import { getMediaType, sha256Hex } from "@/lib/media/types";

/** Upload a paid file: it is locked (encrypted) in your browser first, so the copy on Shelby is unreadable without the key. */
export default function PremiumUploader({ onDone }: { onDone?: () => void }) {
  const wallet = useWallet();

  const { upload } = useStorage();

  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("0.5");
  const [step, setStep] = useState<"idle" | "locking" | "registering" | "uploading" | "done">("idle");
  const [error, setError] = useState("");

  async function checkEnabled() {
    if (enabled !== null || !wallet.walletAddress) return;

    try {
      const data = await (await fetch(`/api/premium?owner=${encodeURIComponent(wallet.walletAddress)}`)).json();

      setEnabled(Boolean(data.enabled));
    } catch {
      setEnabled(false);
    }
  }

  async function run() {
    setError("");

    if (!file) return;

    const octas = aptToOctas(Number(price));

    if (!Number.isFinite(Number(price)) || octas < 1_000_000) {
      setError("The smallest price is 0.01 APT.");
      return;
    }

    if (!getMediaType(file.name)) {
      setError("Paid files must be video, audio or images (for example .mp4, .mp3 or .png).");
      return;
    }

    if (file.size > PREMIUM_MAX_BYTES) {
      setError("Paid files can be up to 200 MB, because they are locked and unlocked in the browser.");
      return;
    }

    try {
      setStep("locking");

      const key = await generateFileKey();

      const locked = await encryptBytes(await file.arrayBuffer(), key);

      // The key is saved first, so a finished upload can never end up without its key.
      setStep("registering");

      const keyHash = await sha256Hex(key);

      const proof = await signAction(wallet, "premium-set", premiumSetFields(file.name, octas, keyHash));

      await postJson("/api/premium", { ...proof, blobName: file.name, priceOctas: octas, key, keyHash });

      setStep("uploading");

      const asset = await upload(new File([locked as BlobPart], file.name, { type: file.type || "application/octet-stream" }));

      const stored = asset.blobName || asset.name;

      if (stored && stored !== file.name) {
        const again = await signAction(wallet, "premium-set", premiumSetFields(stored, octas, keyHash));

        await postJson("/api/premium", { ...again, blobName: stored, priceOctas: octas, key, keyHash });
      }

      setStep("done");
      setFile(null);
      onDone?.();
    } catch (e) {
      setStep("idle");
      setError(e instanceof Error ? e.message : "Could not upload the paid file.");
    }
  }

  const busy = step !== "idle" && step !== "done";

  return (
    <section className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5" onMouseEnter={() => void checkEnabled()} onFocus={() => void checkEnabled()}>
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
        <Lock size={15} className="text-amber-400" />
        Sell a file
      </h2>

      <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
        Your file is locked in your browser before it is sent to Shelby, so nobody can open the public copy. A fan pays
        you in APT, straight to your wallet with no cut, and gets the key. Shelby Studio keeps the key for you, so
        trust in this server matters. Shelbynet uses test tokens.
      </p>

      {enabled === false && (
        <p className="mt-3 text-xs text-amber-300">
          Paid files are not switched on for this server yet (it needs <code>PREMIUM_KEY_SECRET</code>).
        </p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          type="file"
          accept="video/*,audio/*,image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-xs file:text-white"
        />

        <input
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          inputMode="decimal"
          aria-label="Price in APT"
          className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
        />

        <button
          type="button"
          disabled={!file || busy || enabled === false}
          onClick={() => void run()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {busy && <Loader2 size={13} className="animate-spin" />}
          {step === "locking"
            ? "Locking…"
            : step === "registering"
              ? "Saving the key…"
              : step === "uploading"
                ? "Uploading…"
                : "Lock and upload"}
        </button>
      </div>

      <p className="mt-2 text-[11px] text-slate-500">Price in APT. Up to 200 MB. Video, audio or images.</p>

      {step === "done" && <p className="mt-3 text-xs text-emerald-400">Uploaded. It shows in your Library with a lock.</p>}

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </section>
  );
}
