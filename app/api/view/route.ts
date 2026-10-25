import { clientIp, normalizeOwner, rateLimited } from "@/lib/live/server";
import { getViewCounts, social } from "@/lib/social/db";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

const BOTS = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|curl|wget/i;

async function viewerHash(request: Request, day: string): Promise<string> {
  const salt = process.env.VIEW_HASH_SALT || "shelby-studio";

  const text = `${salt}|${clientIp(request)}|${request.headers.get("user-agent") ?? ""}|${day}`;

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));

  return Array.from(new Uint8Array(digest).slice(0, 10), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Public: view counts per page for one creator, e.g. { "clips/a.mp4": 12, "__page__": 40 }. */
export async function GET(request: Request) {
  const owner = normalizeOwner(new URL(request.url).searchParams.get("owner"));

  if (!owner) return json({ success: false, error: "Invalid owner." }, 400);

  return json({ success: true, views: await getViewCounts(owner) });
}

/**
 * Counts one view. The same visitor (network address + browser) counts once per
 * day per page, and only a hash of it is kept, never the address itself.
 */
export async function POST(request: Request) {
  if (BOTS.test(request.headers.get("user-agent") ?? "")) return json({ success: true });

  if (rateLimited(`view:${clientIp(request)}`, 120, 60_000)) return json({ success: true });

  let body: { owner?: unknown; target?: unknown };

  try {
    body = await request.json();
  } catch {
    return json({ success: false }, 400);
  }

  const owner = normalizeOwner(body.owner);

  const target = typeof body.target === "string" ? body.target : "";

  if (!owner || !target || target.length > 300) return json({ success: false }, 400);

  const day = new Date().toISOString().slice(0, 10);

  try {
    await social.addView(owner, target, await viewerHash(request, day), day);
  } catch {
    // Views are nice to have; never show an error for them.
  }

  return json({ success: true });
}
