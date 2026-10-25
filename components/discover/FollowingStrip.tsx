"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Heart } from "lucide-react";

import NotifyToggle from "@/components/social/NotifyToggle";
import { useWallet } from "@/context/WalletContext";

import { liveWatchPath } from "@/lib/live/types";
import { mediaStreamPath } from "@/lib/media/types";

interface Followed {
  owner: string;
  name: string;
  avatarBlob: string | null;
  live: boolean;
  code: string | null;
  title: string;
}

/** The creators you follow, with the ones who are live first. Shown only to a connected wallet that follows someone. */
export default function FollowingStrip() {
  const { walletAddress } = useWallet();

  const [creators, setCreators] = useState<Followed[]>([]);

  useEffect(() => {
    if (!walletAddress) return;

    let cancelled = false;

    const load = () =>
      fetch(`/api/following?follower=${encodeURIComponent(walletAddress)}`, { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => {
          if (!cancelled && data?.success) setCreators(data.creators);
        })
        .catch(() => {});

    void load();

    const timer = setInterval(load, 30000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [walletAddress]);

  if (!walletAddress || creators.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-pink-300">
        <Heart size={14} />
        Creators you follow
      </h2>

      <div className="mt-3">
        <NotifyToggle />
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {creators.map((creator) => (
          <Link
            key={creator.owner}
            href={creator.live && creator.code ? liveWatchPath(creator.code) : `/c/${creator.owner}`}
            className="group flex w-20 shrink-0 flex-col items-center gap-2 text-center"
          >
            <span className="relative">
              {creator.avatarBlob ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaStreamPath(creator.owner, creator.avatarBlob)}
                  alt=""
                  className={`h-16 w-16 rounded-full object-cover ${creator.live ? "ring-4 ring-red-500" : "ring-2 ring-slate-700"}`}
                />
              ) : (
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white ${
                    creator.live ? "ring-4 ring-red-500" : ""
                  }`}
                >
                  {(creator.name.replace(/^0x/, "")[0] || "?").toUpperCase()}
                </span>
              )}

              {creator.live && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-red-600 px-1 text-[9px] font-bold uppercase text-white">
                  Live
                </span>
              )}
            </span>

            <span className="w-full truncate text-xs text-slate-300 group-hover:text-white">{creator.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
