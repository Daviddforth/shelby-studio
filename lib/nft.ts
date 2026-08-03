export interface NFTAsset {
  tokenId: string;
  name: string;
  collection: string;
  image: string;
  description: string;
  owner: string;
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}