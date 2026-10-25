import { getLiveStatus, normalizeOwner } from "@/lib/live/server";
import { OFFLINE } from "@/lib/live/types";
import { getProfile } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";
import { social } from "@/lib/social/db";

export const runtime = "nodejs";

/** Public: the creators a wallet follows, with names and whether they are live right now. */
export async function GET(request: Request) {
  const follower = normalizeOwner(new URL(request.url).searchParams.get("follower"));

  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };

  if (!follower) return new Response(JSON.stringify({ success: false, error: "Invalid wallet." }), { status: 400, headers });

  const owners = (await social.following(follower).catch(() => [] as string[])).slice(0, 50);

  const creators = await Promise.all(
    owners.map(async (owner) => {
      const [profile, live] = await Promise.all([
        getProfile(owner).catch(() => null),
        getLiveStatus(owner).catch(() => OFFLINE),
      ]);

      return {
        owner,
        name: profileLabel(profile, owner),
        avatarBlob: profile?.avatarBlob ?? null,
        live: live.live,
        code: live.code ?? null,
        title: live.title ?? "",
      };
    })
  );

  creators.sort((a, b) => Number(b.live) - Number(a.live));

  return new Response(JSON.stringify({ success: true, creators }), { headers });
}
