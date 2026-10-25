import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

import { clientIp, normalizeOwner, rateLimited } from "@/lib/live/server";
import { DatabaseNotConfiguredError } from "@/lib/media/db";
import { getTipSummary, social } from "@/lib/social/db";
import { checkTipTransaction } from "@/lib/tips/verify";

export const runtime = "nodejs";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Public: a creator's tip totals and latest supporters. */
export async function GET(request: Request) {
  const creator = normalizeOwner(new URL(request.url).searchParams.get("creator"));

  if (!creator) return json({ success: false, error: "Invalid creator." }, 400);

  return json({ success: true, ...(await getTipSummary(creator)) });
}

/**
 * Records a tip after checking it on the network. The browser only says "here
 * is the transaction"; the amount, sender and recipient all come from the chain.
 */
export async function POST(request: Request) {
  if (rateLimited(`tip:${clientIp(request)}`, 20, 60_000)) {
    return json({ success: false, error: "Too many requests. Try again in a minute." }, 429);
  }

  let body: { hash?: unknown; creator?: unknown };

  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request." }, 400);
  }

  const creator = normalizeOwner(body.creator);

  if (!creator || typeof body.hash !== "string" || !/^0x[0-9a-fA-F]{64}$/.test(body.hash)) {
    return json({ success: false, error: "Invalid tip." }, 400);
  }

  let transaction: unknown;

  try {
    transaction = await new Aptos(new AptosConfig({ network: Network.SHELBYNET })).getTransactionByHash({
      transactionHash: body.hash,
    });
  } catch {
    return json({ success: false, error: "The network has not shown that transaction yet. Try again shortly." }, 404);
  }

  const check = checkTipTransaction(transaction, creator);

  if (!check.ok) return json({ success: false, error: check.error }, 400);

  try {
    const isNew = await social.addTip({
      hash: body.hash.toLowerCase(),
      from: normalizeOwner(check.from) ?? check.from,
      to: creator,
      amount: check.amount,
      createdAt: new Date().toISOString(),
    });

    return json({ success: true, counted: isNew });
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) return json({ success: false, error: error.message }, 503);

    console.error("[tips] could not save", error);

    return json({ success: false, error: "Could not record the tip." }, 500);
  }
}
