import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

const apiKey = process.env.NEXT_PUBLIC_SHELBY_API_KEY;

if (!apiKey) {
  throw new Error("Missing NEXT_PUBLIC_SHELBY_API_KEY");
}

export const shelbyClient = new ShelbyClient({
  // Shelby is currently on Testnet.
  // When Shelby launches Mainnet, change this line only.
  network: Network.TESTNET,
  apiKey,
});

// Placeholder for upcoming Portfolio integration
export async function getShelbyAssets() {
  return [];
}