import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

import { fail, handleError, json, readSigned } from "@/lib/apiServer";
import { normalizeOwner } from "@/lib/live/server";
import {
  claimTransaction,
  getPurchase,
  premiumEnabled,
  readPremiumKey,
  recordPurchase,
} from "@/lib/premium/server";
import { premiumUnlockFields } from "@/lib/premium/types";
import { checkTipTransaction } from "@/lib/tips/verify";

export const runtime = "nodejs";

const HASH_RE = /^0x[0-9a-fA-F]{64}$/;

/**
 * Wallet-signed: get the key for a paid file. The creator always gets it. Anyone else gets
 * it once, after the network shows a successful payment from their wallet to the creator for
 * at least the price. Coming back later only needs a signature, no second payment.
 */
export async function POST(request: Request) {
  if (!premiumEnabled()) return fail("Paid files are not set up on this server yet.", 503);

  const signed = await readSigned(request, "unlock", 20, "premium-unlock", (body) => {
    if (typeof body.creator !== "string" || typeof body.blobName !== "string" || !body.blobName) return "Invalid file.";

    if (typeof body.hash !== "string" || (body.hash !== "" && !HASH_RE.test(body.hash))) return "Invalid payment.";

    return premiumUnlockFields(body.creator, body.blobName, body.hash);
  });

  if (signed instanceof Response) return signed;

  const creator = normalizeOwner(signed.body.creator);

  const blobName = signed.body.blobName as string;

  const hash = signed.body.hash as string;

  if (!creator) return fail("Invalid creator.", 400);

  try {
    const premium = await readPremiumKey(creator, blobName);

    if (!premium) return fail("That file is not a paid file.", 404);

    const buyer = signed.owner;

    if (buyer === creator) return json({ success: true, key: premium.key });

    if (await getPurchase(creator, buyer, blobName)) return json({ success: true, key: premium.key });

    if (!hash) return fail("Pay for this file to unlock it.", 402);

    let transaction: unknown;

    try {
      transaction = await new Aptos(new AptosConfig({ network: Network.SHELBYNET })).getTransactionByHash({
        transactionHash: hash,
      });
    } catch {
      return fail("The network has not shown that payment yet. Try again in a moment.", 404);
    }

    const check = checkTipTransaction(transaction, creator);

    if (!check.ok) return fail(check.error, 400);

    if (normalizeOwner(check.from) !== buyer) return fail("That payment was sent from a different wallet.", 403);

    if (BigInt(check.amount) < BigInt(premium.priceOctas)) return fail("That payment is less than the price.", 400);

    if (!(await claimTransaction(hash, buyer, creator, blobName))) {
      return fail("That payment was already used for another file.", 409);
    }

    await recordPurchase(creator, buyer, blobName, { hash: hash.toLowerCase(), amount: check.amount });

    return json({ success: true, key: premium.key });
  } catch (error) {
    return handleError("premium-unlock", error);
  }
}
