export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;

  image: string;

  external_url?: string;

  animation_url?: string;

  background_color?: string;

  attributes: NFTAttribute[];
}