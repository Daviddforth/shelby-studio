import { fail, handleError, json, readSigned } from "@/lib/apiServer";
import { cleanComment, commentScope, type Comment } from "@/lib/comments/types";
import { normalizeOwner, rateLimited } from "@/lib/live/server";
import { getProfile } from "@/lib/profile/db";
import { profileLabel } from "@/lib/profile/types";
import { docs, safeDocs } from "@/lib/store/docs";

export const runtime = "nodejs";

interface Stored {
  author: string;
  body: string;
}

const TARGET_RE = /^[^\s?#][^?#]{0,1023}$/;

/** Public: the latest comments on one file. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const owner = normalizeOwner(params.get("owner"));

  const target = params.get("target") ?? "";

  if (!owner || !TARGET_RE.test(target)) return fail("Invalid page.", 400);

  const found = await safeDocs.list<Stored>("comment", commentScope(owner, target), 100);

  const names = new Map<string, string>();

  for (const author of new Set(found.map((doc) => doc.data.author))) {
    names.set(author, profileLabel(await getProfile(author).catch(() => null), author));
  }

  const comments: Comment[] = found.map((doc) => ({
    id: doc.id,
    author: doc.data.author,
    authorName: names.get(doc.data.author) ?? doc.data.author,
    body: doc.data.body,
    createdAt: doc.createdAt,
  }));

  return json({ success: true, comments });
}

/** Wallet-signed: post a comment. */
export async function POST(request: Request) {
  let cleaned: ReturnType<typeof cleanComment> | null = null;

  const signed = await readSigned(request, "comment", 20, "comment", (body) => {
    if (typeof body.creator !== "string" || typeof body.target !== "string" || !TARGET_RE.test(body.target)) {
      return "Invalid page.";
    }

    cleaned = cleanComment(body.body);

    return cleaned.ok ? [body.creator.toLowerCase(), body.target, cleaned.body] : cleaned.error;
  });

  if (signed instanceof Response) return signed;

  const creator = normalizeOwner(signed.body.creator);

  const target = signed.body.target as string;

  const result = cleaned as ReturnType<typeof cleanComment> | null;

  if (!creator || !result || !result.ok) return fail("Invalid comment.", 400);

  // One comment every few seconds per wallet, whatever address it comes from.
  if (rateLimited(`comment-wallet:${signed.owner}`, 6, 60_000)) {
    return fail("You are commenting too fast. Wait a moment.", 429);
  }

  try {
    const { listOwnerMedia } = await import("@/lib/media/server");

    const media = await listOwnerMedia(creator);

    if (!media.items.some((item) => item.blobName === target)) return fail("That file does not exist.", 404);

    const id = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;

    await docs.put("comment", commentScope(creator, target), id, { author: signed.owner, body: result.body });

    return json({ success: true, id });
  } catch (error) {
    return handleError("comments", error);
  }
}

/** Wallet-signed: delete a comment. The author and the owner of the page can do this. */
export async function DELETE(request: Request) {
  const signed = await readSigned(request, "comment-del", 30, "delete-comment", (body) =>
    typeof body.creator === "string" && typeof body.target === "string" && typeof body.id === "string" && TARGET_RE.test(body.target)
      ? [body.creator.toLowerCase(), body.target, body.id]
      : "Invalid comment."
  );

  if (signed instanceof Response) return signed;

  const creator = normalizeOwner(signed.body.creator);

  if (!creator) return fail("Invalid page.", 400);

  const scope = commentScope(creator, signed.body.target as string);

  const id = signed.body.id as string;

  try {
    const doc = await docs.get<Stored>("comment", scope, id);

    if (!doc) return json({ success: true });

    if (signed.owner !== doc.data.author && signed.owner !== creator) {
      return fail("Only the author or the page owner can delete this comment.", 403);
    }

    await docs.del("comment", scope, id);

    return json({ success: true });
  } catch (error) {
    return handleError("comments", error);
  }
}
