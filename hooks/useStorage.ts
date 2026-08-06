"use client";

import { useState } from "react";

import type {
  UploadedAsset,
} from "@/lib/services/storage";

import {
  uploadDirectlyToShelby,
} from "@/lib/services/shelbyBrowserDirectUpload";

import {
  getUploadMode,
  type LargeUploadProgress,
  type UploadMode,
} from "@/lib/services/shelbyLargeUpload";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";

export function useStorage() {
  const [loading, setLoading] =
    useState(false);

  const [uploadMode, setUploadMode] =
    useState<UploadMode | null>(null);

  const [progress, setProgress] =
    useState<LargeUploadProgress | null>(
      null
    );

  const {
    assets,
    setAssets,
  } = useStorageContext();

  /*
   * Connected Aptos wallet.
   *
   * This wallet will become the Shelby
   * blob owner and will pay the gas for
   * registration + final commit.
   */
  const {
    walletAddress,
    walletConnected,
    account,
    signAndSubmitTransaction,
    signMessage,
  } = useWallet();

  async function upload(
    file: File
  ): Promise<UploadedAsset> {
    if (file.size <= 0) {
      throw new Error(
        "The selected file is empty."
      );
    }

    if (
      !walletConnected ||
      !walletAddress
    ) {
      throw new Error(
        "Connect your wallet before uploading to Shelby."
      );
    }

    if (
      !signAndSubmitTransaction
    ) {
      throw new Error(
        "The connected wallet does not support transaction signing."
      );
    }

    const mode =
      getUploadMode(file);

    setLoading(true);
    setUploadMode(mode);

    setProgress({
      phase: "preparing",
      uploadedBytes: 0,
      totalBytes: file.size,
      percentage: 0,
    });

    try {
      /*
       * ALL file sizes use the same
       * browser-direct Shelby pipeline.
       *
       * MB and GB file bytes never pass
       * through the Next.js server.
       */
      const asset =
        await uploadDirectlyToShelby({
          file,

          walletAddress,

          walletPublicKey:
            account?.publicKey ?? null,

          signAndSubmitTransaction,

          signMessage,

          onProgress(
            nextProgress
          ) {
            setProgress({
              phase:
                nextProgress.phase,

              uploadedBytes:
                nextProgress.uploadedBytes,

              totalBytes:
                nextProgress.totalBytes,

              percentage:
                nextProgress.percentage,

              chunksetIdx:
                nextProgress.chunksetIdx,

              totalChunksets:
                nextProgress.totalChunksets,
            });
          },
        });

      /*
       * Only add the asset after the
       * entire Shelby pipeline succeeds.
       */
      setAssets((previous) => [
        asset,
        ...previous,
      ]);

      setProgress({
        phase: "complete",
        uploadedBytes: file.size,
        totalBytes: file.size,
        percentage: 100,
      });

      return asset;
    } catch (error) {
      setProgress(null);

      throw error;
    } finally {
      setLoading(false);
    }
  }

  function remove(
    uid: string
  ) {
    setAssets((previous) =>
      previous.filter(
        (asset) =>
          asset.uid !== uid
      )
    );
  }

  function replace(
    uid: string,
    updated: UploadedAsset
  ) {
    setAssets((previous) =>
      previous.map((asset) =>
        asset.uid === uid
          ? updated
          : asset
      )
    );
  }

  function resetUploadState() {
    setProgress(null);
    setUploadMode(null);
  }

  return {
    assets,

    loading,
    uploadMode,
    progress,

    upload,
    remove,
    replace,
    resetUploadState,
  };
}