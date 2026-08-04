export interface ShelbyAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: "Stored" | "Pending" | "Failed";
  cid?: string;
}