"use client";

import { useEffect, useRef, useState } from "react";

import { Loader2, Lock, Unlock } from "lucide-react";

import MediaPlayer from "@/components/media/MediaPlayer";

import { useWallet } from "@/context/WalletContext";

import { postJson, signAction } from "@/lib/actionsClient";
import { decryptBytes } from "@/lib/premium/crypto";
import { premiumUnlockFields } from "@/lib/premium/types";
import { payApt } from "@/lib/social/clientPay";
import { formatApt } from "@/lib/social/types";
import { getMediaType, mediaStreamPath, type MediaKind } from "@/lib/media/types";

type Step = "locked" | "paying" | "unlocking" | "downloading" | "ready";

/** Plays a paid file: pay (or sign if you already paid), download the locked file, decrypt it here in the browser, play it. */
export default function PremiumPlayer({
  owner,
  blobName,
  kind,
  title,
  priceOctas,
  poster,
}: {
  owner: string;
  blobName: string;
  kind: MediaKind;
  title: string;
  priceOctas: number;
  poster?: string;
}) {
  const wallet = useWallet();

  const [step, setStep] = useState<Step>("locked");
  const [error, setError] = useState("");
  const [url, setUrl] = useState<string | null>(null);

  const objectUrl = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    []
  );

  const isOwner = wallet.walletAddress?.toLowerCase() === owner.toLowerCase();

  async function unlock(pay: boolean) {
    setError("");

    if (!wallet.walletConnected || !wallet.walletAddress) {
      setError("Connect your wallet first.");
      return;
    }

    try {
      let hash = "";

      if (pay) {
        setStep("paying");

        if (!wallet.signAndSubmitTransaction) throw new Error("Your wallet cannot send payments.");

        hash = await payApt(wallet.signAndSubmitTransaction, owner, priceOctas);
      }

      setStep("unlocking");

      let key = "";

      // A payment can take a moment to show up on the network for the server.
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const proof = await signAction(wallet, "premium-unlock", premiumUnlockFields(owner, blobName, hash));

          ({ key } = await postJson<{ key: string }>("/api/premium/unlock", { ...proof, creator: owner, blobName, hash }));

          break;
        } catch (e) {
          const message = e instanceof Error ? e.message : "";

          if (!/not shown that payment yet/i.test(message) || attempt === 4) throw e;

          await new Promise((resolve) => setTimeout(resolve, 2500));
        }
      }

      setStep("downloading");

      const response = await fetch(mediaStreamPath(owner, blobName));

      if (!response.ok) throw new Error("Could not download the file.");

      const plain = await decryptBytes(await response.arrayBuffer(), key);

      const mime = getMediaType(blobName)?.mime ?? "application/octet-stream";

      const next = URL.createObjectURL(new Blob([plain], { type: mime }));

      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);

      objectUrl.current = next;

      setUrl(next);
      setStep("ready");
    } catch (e) {
      setStep("locked");

      const message = e instanceof Error ? e.message : "";

      setError(
        /reject|denied|cancel/i.test(message)
          ? "Cancelled."
          : /pay for this file/i.test(message)
            ? "You have not bought this file with this wallet yet."
            : message || "Could not unlock the file."
      );
    }
  }

  if (step === "ready" && url) {
    return (
      <div>
        <MediaPlayer kind={kind} src={url} title={title} poster={poster} />

        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
          <Unlock size={12} />
          Unlocked. This file was decrypted in your browser.
        </p>
      </div>
    );
  }

  const busy = step !== "locked";

  return (
    <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-900 p-6 text-center">
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm" />
      )}

      <div className="relative">
        <Lock size={28} className="mx-auto text-amber-400" />

        <p className="mt-3 text-base font-semibold text-white">Paid file</p>

        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
          The creator locked this file. Pay once and it is yours: the money goes straight to the creator.
          Shelbynet uses test tokens.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void unlock(!isOwner)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            {step === "paying"
              ? "Approve the payment…"
              : step === "unlocking"
                ? "Checking the payment…"
                : step === "downloading"
                  ? "Unlocking…"
                  : isOwner
                    ? "Open your file"
                    : `Unlock for ${formatApt(priceOctas)} APT`}
          </button>

          {!isOwner && !busy && wallet.walletConnected && (
            <button
              type="button"
              onClick={() => void unlock(false)}
              className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm text-slate-300 transition hover:text-white"
            >
              I already bought this
            </button>
          )}
        </div>

        {!wallet.walletConnected && <p className="mt-3 text-xs text-slate-500">Connect your wallet to unlock.</p>}

        {error && <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-red-400">{error}</p>}
      </div>
    </div>
  );
}
