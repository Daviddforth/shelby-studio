"use client";

import { useState } from "react";

import { uploadToShelby } from "@/lib/services/storage";
import { UploadedAsset } from "@/lib/services/storage";
import { useStorageContext } from "@/context/StorageContext";

export function useStorage() {
  const [loading, setLoading] = useState(false);

  const {
    assets,
    setAssets,
  } = useStorageContext();

  async function upload(file: File) {
    setLoading(true);

    try {
      const asset = await uploadToShelby(file);

      setAssets((prev) => [asset, ...prev]);

      return asset;
    } finally {
      setLoading(false);
    }
  }

  function remove(uid: string) {
    setAssets((prev) =>
      prev.filter((asset) => asset.uid !== uid)
    );
  }

  function replace(
    uid: string,
    updated: UploadedAsset
  ) {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.uid === uid ? updated : asset
      )
    );
  }

  return {
    assets,
    loading,
    upload,
    remove,
    replace,
  };
}