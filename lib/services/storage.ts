export interface UploadedAsset {
  uid: string;
  name: string;
  size: number;
  uploadedAt: string;
  network: string;
  status:
    | "Uploading"
    | "Stored"
    | "Failed";

  blobName?: string;
  owner?: string;

  registrationTransaction?: string;
  commitTransaction?: string;
}

interface ShelbyUploadResponse {
  success: boolean;
  asset?: UploadedAsset;
  error?: string;
}

export async function uploadToShelby(
  file: File
): Promise<UploadedAsset> {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
      "/api/storage/upload",
      {
        method: "POST",
        body: formData,
      }
    );

  /*
   * Read the raw response first.
   *
   * This lets us see the REAL error if
   * Next.js, Codespaces, or the route
   * returns HTML/text instead of JSON.
   */
  const rawResponse =
    await response.text();

  let result:
    ShelbyUploadResponse;

  try {
    result =
      JSON.parse(rawResponse);
  } catch {
    console.error(
      "Shelby upload server returned a non-JSON response:",
      {
        status:
          response.status,

        statusText:
          response.statusText,

        response:
          rawResponse,
      }
    );

    throw new Error(
      `Shelby upload server returned ${response.status} ${response.statusText}. Check the terminal for the server response.`
    );
  }

  if (
    !response.ok ||
    !result.success ||
    !result.asset
  ) {
    throw new Error(
      result.error ||
        `Shelby Storage upload failed with HTTP ${response.status}.`
    );
  }

  return result.asset;
}
