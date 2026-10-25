"use client";

import { useEffect, useState } from "react";

import { Check, Loader2, UserPlus } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

import { signWalletMessage } from "@/lib/media/clientSign";
import { buildFollowMessage, type FollowAction } from "@/lib/social/types";

/** Follow a creator with one free wallet signature. Nothing goes on-chain. */
export default function FollowButton({
  creator,
  initialCount,
}: {
  creator: string;
  initialCount: number;
}) {
  const { walletConnected, walletAddress, account, signMessage } = useWallet();

  const [count, setCount] = useState(initialCount);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isSelf = Boolean(walletAddress) && walletAddress?.toLowerCase() === creator.toLowerCase();

  useEffect(() => {
    if (!walletAddress) return;

    let cancelled = false;

    fetch(`/api/follow?creator=${encodeURIComponent(creator)}&follower=${encodeURIComponent(walletAddress)}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data?.success) {
          setFollowing(Boolean(data.following));
          setCount(Number(data.count) || 0);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [creator, walletAddress]);

  async function toggle() {
    if (!walletConnected || !walletAddress) {
      setError("Connect your wallet to follow.");
      return;
    }

    const action: FollowAction = following ? "unfollow" : "follow";

    setBusy(true);
    setError("");

    try {
      const issuedAt = new Date().toISOString();

      const proof = await signWalletMessage({
        signMessage,
        account,
        message: buildFollowMessage(creator, action, issuedAt),
      });

      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: walletAddress, creator, action, issuedAt, ...proof }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) throw new Error(data.error || "Could not update follow.");

      setFollowing(Boolean(data.following));
      setCount(Number(data.count) || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update follow.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <div className="flex items-center gap-3">
        {!isSelf && (
          <button
            type="button"
            onClick={() => void toggle()}
            disabled={busy}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
              following
                ? "border-slate-600 text-slate-200 hover:border-red-500/60 hover:text-red-300"
                : "border-blue-500 bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : following ? <Check size={14} /> : <UserPlus size={14} />}
            {following ? "Following" : "Follow"}
          </button>
        )}

        <span className="text-sm text-slate-400">
          <span className="font-semibold text-white">{count}</span> {count === 1 ? "follower" : "followers"}
        </span>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
