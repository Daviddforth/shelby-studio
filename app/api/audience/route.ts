import { normalizeOwner } from "@/lib/live/server";
import { getAudienceStats } from "@/lib/social/db";

export const runtime = "nodejs";

/** Public: a creator's views, followers and tips. These are the same numbers shown on their public page. */
export async function GET(request: Request) {
  const owner = normalizeOwner(new URL(request.url).searchParams.get("owner"));

  if (!owner) {
    return new Response(JSON.stringify({ success: false, error: "Invalid owner." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true, ...(await getAudienceStats(owner)) }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
