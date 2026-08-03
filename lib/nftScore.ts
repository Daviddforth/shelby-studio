import { Attribute } from "../components/types";

export function calculateNFTScore(
  name: string,
  description: string,
  image: string,
  attributes: Attribute[]
) {

  let score = 0;


  if (name.trim()) score += 25;

  if (description.trim()) score += 25;

  if (image.trim()) score += 25;

  if (attributes.length > 0) score += 25;


  return score;
}