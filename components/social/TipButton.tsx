"use client";

import { useState } from "react";

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

import { Coins, Loader2, X } from "lucide-react";

import { useRouter } from "next/navigation";

import { useWallet } from "@/context/WalletContext";

import {
  TIP_FUNCTION,
  TIP_MIN_OCTAS,
  TIP_PRESETS_APT,
  aptToOctas,
  formatApt,
} from "@/lib/social/types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends APT straight from the fan's wallet to the creator's wallet. Shelby Studio
 * never holds the money and takes no cut. The server only records a tip after it
 * finds the transfer on the network.
 */
export default function TipButton({
  creator,
  name,
  className = "",
}: {
  creator: string;
  name: string;
  className?: string;
}) {
  const router = useRouter();

  const { walletConnected, walletAddress, signAndSubmitTransaction } = useWallet();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(TIP_PRESETS_APT[1]);
  const [custom, setCustom] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "confirming" | "done">("idle");
  const [error, setError] = useState("");

  const isSelf = Boolean(walletAddress) && walletAddress?.toLowerCase() === creator.toLowerCase();

  const chosen = custom.trim() ? Number(custom) : amount;

  async function send() {
    setError("");

    const octas = aptToOctas(chosen);

    if (!Number.isFinite(chosen) || octas < TIP_MIN_OCTAS) {
      setError("The smallest tip is 0.01 APT.");
      return;
    }

    if (!walletConnected || !signAndSubmitTransaction) {
      setError("Connect your wallet first.");
      return;
    }

    setState("sending");

    try {
      const result = await signAndSubmitTransaction({
        data: { function: TIP_FUNCTION, functionArguments: [creator, octas] },
      });

      const hash: string | undefined = result?.hash;

      if (!hash) throw new Error("Your wallet did not return a transaction.");

      setState("confirming");

      await new Aptos(new AptosConfig({ network: Network.SHELBYNET })).waitForTransaction({
        transactionHash: hash,
      });

      // The server checks the transfer on the network. It can take a moment to appear.
      let lastError = "";

      for (let attempt = 0; attempt < 5; attempt++) {
        const response = await fetch("/api/tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hash, creator }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          setState("done");
          router.refresh();
          return;
        }

        lastError = data.error || "Could not record the tip.";

        if (response.status !== 404) break;

        await sleep(2000);
      }

      // The money was sent either way; only the public record is missing.
      setState("idle");
      setError(`Your tip was sent, but it could not be added to the supporters list yet (${lastError}).`);
    } catch (e) {
      setState("idle");

      const message = e instanceof Error ? e.message : "";

      setError(/reject|denied|cancel/i.test(message) ? "You cancelled the tip." : message || "The tip could not be sent.");
    }
  }

  if (isSelf) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:brightness-110 ${className}`}
      >
        <Coins size={15} />
        Tip
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Tip ${name}`}
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 text-slate-100">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-white">Tip {name}</h2>

              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  setOpen(false);
                  setState("idle");
                  setError("");
                }}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {state === "done" ? (
              <p className="mt-4 text-sm leading-6 text-emerald-300">
                Sent. {formatApt(aptToOctas(chosen))} APT went straight to {name}. Thank you for the support.
              </p>
            ) : (
              <>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  The money goes from your wallet directly to the creator&apos;s wallet. Shelby Studio never holds it
                  and takes no cut. Shelbynet uses test tokens, which have no market value.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {TIP_PRESETS_APT.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setAmount(value);
                        setCustom("");
                      }}
                      className={`rounded-lg border py-2 text-sm font-medium transition ${
                        !custom && amount === value
                          ? "border-amber-400 bg-amber-500/15 text-white"
                          : "border-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      {value} APT
                    </button>
                  ))}
                </div>

                <input
                  value={custom}
                  onChange={(event) => setCustom(event.target.value)}
                  inputMode="decimal"
                  placeholder="Or type an amount in APT"
                  className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
                />

                {error && <p className="mt-3 text-xs leading-5 text-red-400">{error}</p>}

                <button
                  type="button"
                  disabled={state === "sending" || state === "confirming"}
                  onClick={() => void send()}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  {(state === "sending" || state === "confirming") && <Loader2 size={14} className="animate-spin" />}
                  {state === "sending"
                    ? "Approve in your wallet…"
                    : state === "confirming"
                      ? "Confirming…"
                      : walletConnected
                        ? `Send ${Number.isFinite(chosen) ? chosen : 0} APT`
                        : "Connect your wallet to tip"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
