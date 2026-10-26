import { actionMessage } from "@/lib/actions";
import { signWalletMessage } from "@/lib/media/clientSign";

type Wallet = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signMessage: (input: any) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any;
  walletAddress: string | null | undefined;
};

/** Signs an action with the connected wallet (free, nothing goes on-chain) and returns the proof to send. */
export async function signAction(wallet: Wallet, action: string, fields: string[]) {
  if (!wallet.walletAddress) throw new Error("Connect your wallet first.");

  const issuedAt = new Date().toISOString();

  const proof = await signWalletMessage({
    signMessage: wallet.signMessage,
    account: wallet.account,
    message: await actionMessage(action, fields, issuedAt),
  });

  return { owner: wallet.walletAddress, issuedAt, ...proof };
}

/** Small helper for calling our own JSON APIs. Throws the server's message on failure. */
export async function postJson<T = Record<string, unknown>>(url: string, body: unknown, method = "POST"): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) throw new Error(data.error || "Something went wrong. Try again.");

  return data as T;
}
