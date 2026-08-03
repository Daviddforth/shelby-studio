import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

const apiKey = process.env.NEXT_PUBLIC_SHELBY_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_SHELBY_API_KEY");
}

export const shelbyClient = new ShelbyClient({
  network: Network.TESTNET,
  apiKey,
});