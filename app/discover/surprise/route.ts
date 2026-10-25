import { getRecentItems } from "@/lib/media/db";
import { getMediaType, mediaPagePath } from "@/lib/media/types";

export const dynamic = "force-dynamic";

/** "Surprise me": jump to a random file a creator has chosen to share. */
export async function GET(request: Request) {
  const items = (await getRecentItems(100)).filter((item) => getMediaType(item.blobName));

  const pick = items[Math.floor(Math.random() * items.length)];

  const target = pick ? mediaPagePath(pick.owner, pick.blobName) : "/discover";

  return new Response(null, {
    status: 307,
    headers: { Location: new URL(target, request.url).toString(), "Cache-Control": "no-store" },
  });
}
