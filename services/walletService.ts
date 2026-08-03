import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptos = new Aptos(
  new AptosConfig({
    network: Network.TESTNET,
  })
);

export async function getOwnedNFTs(ownerAddress: string) {
  try {
    const response = await aptos.getOwnedDigitalAssets({
      ownerAddress,
    });

    return response ?? [];
  } catch (error) {
    console.error("Failed to fetch NFTs:", error);
    return [];
  }
}