import { Account } from "@aptos-labs/ts-sdk";

/** A fake wallet that signs like Petra does: the message is wrapped in an APTOS envelope. */
export function fakeWallet(account: Account) {
  return async ({ message, nonce }: { message: string; nonce: string }) => {
    const fullMessage = `APTOS\nmessage: ${message}\nnonce: ${nonce}`;

    return {
      fullMessage,
      signature: account.sign(new TextEncoder().encode(fullMessage)),
    };
  };
}
