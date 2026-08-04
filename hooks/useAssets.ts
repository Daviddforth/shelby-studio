"use client";

import { useState } from "react";
import { UploadedAsset } from "@/lib/services/storage";

export function useAssets() {
  const [assets, setAssets] = useState<UploadedAsset[]>([]);

  function addAsset(asset: UploadedAsset) {
    setAssets((prev) => [asset, ...prev]);
  }

  function deleteAsset(uid: string) {
    setAssets((prev) =>
      prev.filter((asset) => asset.uid !== uid)
    );
  }

  function replaceAsset(updated: UploadedAsset) {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.uid === updated.uid ? updated : asset
      )
    );
  }

  return {
    assets,
    addAsset,
    deleteAsset,
    replaceAsset,
  };
}