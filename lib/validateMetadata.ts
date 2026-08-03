import { Attribute } from "@/components/types";

interface ValidationInput {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
}

export function validateMetadata(data: ValidationInput) {
  return {
    hasName: data.name.trim().length > 0,
    hasDescription: data.description.trim().length > 0,
    hasImage: data.image.trim().length > 0,
    hasAttributes: data.attributes.length > 0,

    isValid:
      data.name.trim().length > 0 &&
      data.description.trim().length > 0 &&
      data.image.trim().length > 0 &&
      data.attributes.length > 0,
  };
}