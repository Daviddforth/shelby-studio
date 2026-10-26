import { notFound } from "next/navigation";
import { connection } from "next/server";

import { getLiveStatus, normalizeOwner } from "@/lib/live/server";
import { OFFLINE } from "@/lib/live/types";
import { mediaStreamPath } from "@/lib/media/types";
import { getProfile } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";
import { getFollowerCount } from "@/lib/social/db";

type PageProps = { params: Promise<{ owner: string }> };

/**
 * A small card creators paste on their own site. Wallets do not work inside someone else's
 * page, so the buttons open the creator's Shelby Studio page, where following and tipping happen.
 */
export default async function SupportCard({ params }: PageProps) {
  await connection();

  const owner = normalizeOwner(decodeURIComponent((await params).owner));

  if (!owner) notFound();

  const [profile, followers, live] = await Promise.all([
    getProfile(owner).catch(() => null),
    getFollowerCount(owner),
    getLiveStatus(owner).catch(() => OFFLINE),
  ]);

  const name = profileLabel(profile, owner);

  const page = `/c/${owner}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617] p-3 text-slate-100">
      <div className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-[#1e293b] bg-[#0f172a] p-4">
        {profile?.avatarBlob ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaStreamPath(owner, profile.avatarBlob)}
            alt=""
            className={`h-14 w-14 shrink-0 rounded-full object-cover ${live.live ? "ring-2 ring-red-500" : ""}`}
          />
        ) : (
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white ${
              live.live ? "ring-2 ring-red-500" : ""
            }`}
          >
            {(name.replace(/^0x/, "")[0] || "?").toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{name}</p>

          <p className="text-xs text-slate-400">
            {live.live ? <span className="font-semibold text-red-400">Live now · </span> : null}
            {followers} {followers === 1 ? "follower" : "followers"}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <a
              href={page}
              target="_blank"
              rel="noopener"
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500"
            >
              Follow
            </a>

            <a
              href={page}
              target="_blank"
              rel="noopener"
              className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white hover:brightness-110"
            >
              Tip
            </a>

            {live.live && live.code && (
              <a
                href={`/live/${live.code}`}
                target="_blank"
                rel="noopener"
                className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
              >
                Watch live
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
