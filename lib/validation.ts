export function validateMetadata(
  name: string,
  description: string,
  image: string,
  attributeCount: number
) {
  const errors: string[] = [];

  if (!name.trim()) {
    errors.push("NFT name is required.");
  }

  if (!description.trim()) {
    errors.push("Description is required.");
  }

  if (!image.trim()) {
    errors.push("Please upload or provide an image.");
  }

  if (attributeCount === 0) {
    errors.push("Add at least one attribute.");
  }

  return errors;
}