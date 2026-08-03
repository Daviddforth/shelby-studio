import { shelbyClient } from "../config/shelby";

export async function uploadToShelby(
  file: File,
  signer: any,
) {
  try {
    const result = await shelbyClient.upload({
      signer,
      blobData: new Uint8Array(await file.arrayBuffer()),
      blobName: file.name,

      // expires after 24 hours
      expirationMicros:
        (Date.now() + 24 * 60 * 60 * 1000) * 1000,
    });

    console.log(result);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}