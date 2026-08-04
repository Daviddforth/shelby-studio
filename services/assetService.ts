import { ShelbyAsset } from "@/types/asset";

export async function getAssetsForNFT(
  nftId: string
): Promise<ShelbyAsset[]> {

  // TODO:
  // Replace with Shelby SDK once file listing becomes available.

  return [
    {
      id: "1",
      name: "cover.png",
      type: "Image",
      size: 254832,
      uploadedAt: "2026-08-03",
      status: "Stored",
    },
    {
      id: "2",
      name: "metadata.json",
      type: "Metadata",
      size: 1520,
      uploadedAt: "2026-08-03",
      status: "Stored",
    },
  ];
}