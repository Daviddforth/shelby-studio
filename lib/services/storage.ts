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

