import { TIP_FUNCTION, TIP_MIN_OCTAS } from "@/lib/social/types";

export type TipCheck =
  | { ok: true; from: string; amount: string }
  | { ok: false; error: string };

/** The few fields of an Aptos user transaction we look at. */
interface TxLike {
  type?: string;
  success?: boolean;
  sender?: string;
  payload?: { type?: string; function?: string; arguments?: unknown[] };
}

function same(a: string, b: string): boolean {
  const strip = (value: string) => value.toLowerCase().replace(/^0x/, "").replace(/^0+/, "");

  return strip(a) === strip(b);
}

/**
 * A tip counts only if it is a successful plain APT transfer to the creator.
 * Everything is read from the chain's own record of the transaction, never from
 * what the browser says, so a tip cannot be invented.
 */
export function checkTipTransaction(tx: unknown, creator: string): TipCheck {
  const t = tx as TxLike | null;

  if (!t || t.type !== "user_transaction") {
    return { ok: false, error: "That is not a completed transaction." };
  }

  if (t.success !== true) return { ok: false, error: "That transaction failed on the network." };

  if (typeof t.sender !== "string") return { ok: false, error: "Transaction has no sender." };

  if (t.payload?.type !== "entry_function_payload" || t.payload.function !== TIP_FUNCTION) {
    return { ok: false, error: "That transaction is not a simple APT transfer." };
  }

  const [recipient, amount] = t.payload.arguments ?? [];

  if (typeof recipient !== "string" || !same(recipient, creator)) {
    return { ok: false, error: "That transfer was not sent to this creator." };
  }

  if (typeof amount !== "string" && typeof amount !== "number") {
    return { ok: false, error: "The transfer has no amount." };
  }

  let value: bigint;

  try {
    value = BigInt(amount);
  } catch {
    return { ok: false, error: "The transfer amount is not valid." };
  }

  if (value < BigInt(TIP_MIN_OCTAS)) {
    return { ok: false, error: "That tip is below the minimum of 0.01 APT." };
  }

  if (same(t.sender, creator)) {
    return { ok: false, error: "Tips to yourself are not counted." };
  }

  return { ok: true, from: t.sender, amount: value.toString() };
}
