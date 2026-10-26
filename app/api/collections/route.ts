import { fail, handleError, json, readSigned } from "@/lib/apiServer";
import { COLLECTION_ID_RE, COLLECTIONS_PER_CREATOR, cleanCollection, collectionFields } from "@/lib/collections/types";
import { listCollections } from "@/lib/collections/db";
import { normalizeOwner } from "@/lib/live/server";
import { docs } from "@/lib/store/docs";

export const runtime = "nodejs";

/** Public: a creator's collections. */
export async function GET(request: Request) {
  const owner = normalizeOwner(new URL(request.url).searchParams.get("owner"));

  if (!owner) return fail("Invalid owner.", 400);

  return json({ success: true, collections: await listCollections(owner) });
}

/** Wallet-signed: create or update one of your collections. */
export async function POST(request: Request) {
  let cleaned: ReturnType<typeof cleanCollection> | null = null;

  const signed = await readSigned(request, "collection", 20, "save-collection", (body) => {
    if (typeof body.id !== "string" || !COLLECTION_ID_RE.test(body.id)) return "Invalid collection id.";

    cleaned = cleanCollection(body);

    return cleaned.ok ? collectionFields(body.id, cleaned.data) : cleaned.error;
  });

  if (signed instanceof Response) return signed;

  const id = signed.body.id as string;

  const result = cleaned as ReturnType<typeof cleanCollection> | null;

  if (!result || !result.ok) return fail("Invalid collection.", 400);

  try {
    // Every file must really exist under this wallet.
    const { listOwnerMedia } = await import("@/lib/media/server");

    const media = await listOwnerMedia(signed.owner);

    const existing = new Set(media.items.map((item) => item.blobName));

    if (result.data.items.some((item) => !existing.has(item))) {
      return fail("One of the files is not in your Library any more.", 400);
    }

    const current = await docs.list("collection", signed.owner, COLLECTIONS_PER_CREATOR + 1);

    if (!current.some((doc) => doc.id === id) && current.length >= COLLECTIONS_PER_CREATOR) {
      return fail(`You can have up to ${COLLECTIONS_PER_CREATOR} collections.`, 400);
    }

    await docs.put("collection", signed.owner, id, result.data);

    return json({ success: true, id });
  } catch (error) {
    return handleError("collections", error);
  }
}

/** Wallet-signed: delete one of your collections. The files stay in your Library. */
export async function DELETE(request: Request) {
  const signed = await readSigned(request, "collection-del", 20, "delete-collection", (body) =>
    typeof body.id === "string" && COLLECTION_ID_RE.test(body.id) ? [body.id] : "Invalid collection id."
  );

  if (signed instanceof Response) return signed;

  try {
    await docs.del("collection", signed.owner, signed.body.id as string);

    return json({ success: true });
  } catch (error) {
    return handleError("collections", error);
  }
}
