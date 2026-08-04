export interface UploadedAsset {
  uid: string;
  name: string;
  size: number;
  uploadedAt: string;
  network: string;
  status: "Stored";
}

export async function uploadToShelby(
  file: File
): Promise<UploadedAsset> {
  // Temporary Shelby simulation
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    uid: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    network: "Shelbynet",
    status: "Stored",
  };
}