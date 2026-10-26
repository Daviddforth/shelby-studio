import { fail, handleError, json, readSigned } from "@/lib/apiServer";
import { normalizeOwner } from "@/lib/live/server";
import { sha256Hex } from "@/lib/media/types";
import { getPremium, listPremium, premiumEnabled, savePremium } from "@/lib/premium/server";
import { premiumSetFields, validPrice } from "@/lib/premium/types";

export const runtime = "nodejs";

/** Public: whether paid files work here, and the price of one file (or all of a creator's). Never the key. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const owner = normalizeOwner(params.get("owner"));

  if (!owner) return fail("Invalid owner.", 400);

  const blob = params.get("blob");

  if (blob) return json({ success: true, enabled: premiumEnabled(), premium: await getPremium(owner, blob) });

  return json({ success: true, enabled: premiumEnabled(), premium: await listPremium(owner) });
}

/**
 * Wallet-signed: register a paid file. The key comes from the creator's browser. What is
 * signed includes the key's hash, and the server checks the key matches it, so the key
 * cannot be swapped on the way.
 */
export async function POST(request: Request) {
  if (!premiumEnabled()) return fail("Paid files are not set up on this server yet.", 503);

  const signed = await readSigned(request, "premium", 10, "premium-set", (body) => {
    if (typeof body.blobName !== "string" || !body.blobName || body.blobName.length > 1024) return "Invalid file.";

    if (!validPrice(body.priceOctas)) return "The price must be between 0.01 and 1,000 APT.";

    if (typeof body.key !== "string" || body.key.length !== 44) return "Invalid key.";

    if (typeof body.keyHash !== "string" || !/^[0-9a-f]{64}$/.test(body.keyHash)) return "Invalid key.";

    return premiumSetFields(body.blobName, body.priceOctas, body.keyHash);
  });

  if (signed instanceof Response) return signed;

  const blobName = signed.body.blobName as string;

  const priceOctas = signed.body.priceOctas as number;

  const key = signed.body.key as string;

  if ((await sha256Hex(key)) !== signed.body.keyHash) return fail("The key does not match what was signed.", 400);

  try {
    // The encrypted file is uploaded after this call, so only the owner's own listing is checked
    // when the file is already there (a price change). A new file is allowed to not exist yet.
    const existing = await getPremium(signed.owner, blobName);

    if (existing) {
      const { listOwnerMedia } = await import("@/lib/media/server");

    const media = await listOwnerMedia(signed.owner);

      if (!media.items.some((item) => item.blobName === blobName)) return fail("That file is not in your Library.", 400);
    }

    await savePremium(signed.owner, blobName, priceOctas, key);

    return json({ success: true });
  } catch (error) {
    return handleError("premium", error);
  }
}
