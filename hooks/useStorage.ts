"use client";

import { useState } from "react";

import {
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk";

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

import {
  deleteShelbyAsset,
} from "@/lib/services/shelbyDelete";

import { useStorageContext } from "@/context/StorageContext";
import { useWallet } from "@/context/WalletContext";

export function useStorage() {
  const aptos =
    new Aptos(
      new AptosConfig({
        network: Network.SHELBYNET,
      })
    );

  const [loading, setLoading] =
    useState(false);

  const [deletingUid, setDeletingUid] =
    useState<string | null>(null);

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

  async function remove(
    uid: string
  ) {
    const asset =
      assets.find(
        (item) => item.uid === uid
      );

    if (!asset) {
      throw new Error(
        "Asset could not be found."
      );
    }

    if (!asset.blobName) {
      throw new Error(
        "This asset does not have a Shelby blob name."
      );
    }

    if (
      !walletConnected ||
      !walletAddress
    ) {
      throw new Error(
        "Connect your wallet before deleting an asset."
      );
    }

    if (
      !signAndSubmitTransaction
    ) {
      throw new Error(
        "The connected wallet does not support transaction signing."
      );
    }

    if (deletingUid) {
      return;
    }

    setDeletingUid(uid);

    try {
      /*
       * Delete the actual Shelby object
       * using the connected wallet.
       *
       * The connected wallet is the blob owner,
       * signer and gas payer.
       */
      const result =
        await deleteShelbyAsset({
          blobName:
            asset.blobName,

          walletAddress,

          signAndSubmitTransaction,

          waitForTransaction:
            async ({
              transactionHash,
            }) => {
              return aptos.waitForTransaction({
                transactionHash,
              });
            },
        });

      /*
       * Shelby confirmed the deletion.
       *
       * Only now remove the asset from the
       * Asset Manager's local state.
       */
      setAssets((previous) =>
        previous.filter(
          (item) =>
            item.uid !== uid
        )
      );

      console.log(
        "Shelby asset deleted:",
        {
          uid,
          blobName:
            asset.blobName,
          transaction:
            result.transactionHash,
        }
      );

      return result;
    } finally {
      setDeletingUid(null);
    }
  }

  async function replace(
    uid: string,
    file: File
  ): Promise<UploadedAsset> {
    const oldAsset = assets.find(
      (item) => item.uid === uid
    );

    if (!oldAsset) {
      throw new Error(
        "Asset could not be found."
      );
    }

    if (!oldAsset.blobName) {
      throw new Error(
        "The existing asset does not have a Shelby blob name."
      );
    }

    if (file.size <= 0) {
      throw new Error(
        "The selected replacement file is empty."
      );
    }

    if (
      !walletConnected ||
      !walletAddress
    ) {
      throw new Error(
        "Connect your wallet before replacing an asset."
      );
    }

    if (!signAndSubmitTransaction) {
      throw new Error(
        "The connected wallet does not support transaction signing."
      );
    }

    if (deletingUid) {
      return oldAsset;
    }

    setDeletingUid(uid);
    setLoading(true);

    try {
      /*
       * Upload the replacement as a new Shelby object.
       *
       * The existing upload pipeline handles:
       * - commitments
       * - registration
       * - storage-provider upload
       * - final commit
       * - wallet signing
       */
      const newAsset =
        await uploadDirectlyToShelby({
          file,

          walletAddress,

          walletPublicKey:
            account?.publicKey ?? null,

          signAndSubmitTransaction,

          signMessage,
        });

      /*
       * Delete the old Shelby object only after
       * the replacement has been successfully
       * uploaded and committed.
       */
      const deleteResult =
        await deleteShelbyAsset({
          blobName:
            oldAsset.blobName,

          walletAddress,

          signAndSubmitTransaction,

          waitForTransaction:
            (args) =>
              aptos.waitForTransaction(args),
        });

      /*
       * Replace the old local asset with the
       * newly uploaded asset.
       */
      setAssets((previous) =>
        previous.map((item) =>
          item.uid === uid
            ? newAsset
            : item
        )
      );

      console.log(
        "Shelby asset replaced:",
        {
          oldUid: uid,
          oldBlobName:
            oldAsset.blobName,
          newUid:
            newAsset.uid,
          newBlobName:
            newAsset.blobName,
          deleteTransaction:
            deleteResult.transactionHash,
          commitTransaction:
            newAsset.commitTransaction,
        }
      );

      return newAsset;
    } catch (error) {
      /*
       * If the new upload succeeded but the
       * old deletion failed, keep the old
       * local asset visible rather than
       * pretending the replacement completed.
       */
      console.error(
        "Shelby asset replacement failed:",
        error
      );

      throw error;
    } finally {
      setDeletingUid(null);
      setLoading(false);
    }
  }

  async function refreshAssets() {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      throw new Error(
        "Connect your wallet before refreshing assets."
      );
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `/api/shelby/assets?walletAddress=${encodeURIComponent(
            walletAddress.toString()
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      let result: {
        success?: boolean;
        error?: string;
        assets?: UploadedAsset[];
      } = {};

      try {
        result =
          await response.json();
      } catch {
        // Response was not JSON.
      }

      if (
        !response.ok ||
        !result.success ||
        !Array.isArray(result.assets)
      ) {
        throw new Error(
          result.error ||
            "Failed to synchronize assets from Shelby."
        );
      }

      setAssets(result.assets);

      return result.assets;
    } finally {
      setLoading(false);
    }
  }

  return {
    assets,

    loading,
    deletingUid,
    uploadMode,
    progress,

    upload,
    remove,
    replace,
    refreshAssets,
  };
}