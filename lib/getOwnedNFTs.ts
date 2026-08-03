import { aptos } from "./aptos";

export async function getOwnedNFTs(address: string) {
  try {
    const response = await aptos.getAccountOwnedTokens({
      accountAddress: address,
    });

    return response;
  } catch (err) {
    console.error(err);
    return [];
  }
}