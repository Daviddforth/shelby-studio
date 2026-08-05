export interface UploadedAsset {
  uid: string;
  name: string;
  size: number;
  uploadedAt: string;
  network: string;
  status: "Uploading" | "Stored" | "Failed";
  blobName?: string;
  owner?: string;
}

interface ShelbyUploadResponse {
  success: boolean;
  asset?: UploadedAsset;
  error?: string;
}

export async function uploadToShelby(
  file: File
): Promise<UploadedAsset> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    "/api/storage/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  let result: ShelbyUploadResponse;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Invalid response from Shelby Studio upload server."
    );
  }

  if (
    !response.ok ||
    !result.success ||
    !result.asset
  ) {
    throw new Error(
      result.error ||
        "Shelby Storage upload failed."
    );
  }

  return result.asset;
}
