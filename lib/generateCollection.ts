import { NFTMetadata } from "./generateMetadata";

export function generateCollection(
  metadata: NFTMetadata,
  amount: number
) {
  const collection = [];

  for (let i = 1; i <= amount; i++) {
    collection.push({
      ...metadata,
      name: `${metadata.name} #${i}`,
    });
  }

  return collection;
}