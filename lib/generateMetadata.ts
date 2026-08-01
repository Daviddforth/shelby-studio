export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}

export function generateMetadata(
  name: string,
  description: string,
  image: string,
  attributes: NFTAttribute[]
): string {
  const metadata: NFTMetadata = {
    name,
    description,
    image,
    attributes,
  };

  return JSON.stringify(metadata, null, 2);
}