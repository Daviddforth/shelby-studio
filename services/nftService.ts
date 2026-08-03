import { NFTAsset } from "@/lib/nft";

export async function fetchWalletNFTs(
  address: string
): Promise<NFTAsset[]> {
  console.log("Loading NFTs for:", address);

  // We'll connect this to Aptos in the next step.
  return [];
}