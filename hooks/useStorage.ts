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

type AssetHistoryAction =
  | "upload"
  | "replace"
  | "delete";

interface AssetHistoryItem {
  id: string;
  action: AssetHistoryAction;
  assetName: string;
  assetUid?: string;
  blobName?: string;
  transactionHash?: string;
  timestamp: string;
}

const HISTORY_PREFIX =
  "shelby-studio-asset-history:";

const MAX_HISTORY_ITEMS = 100;

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

  const {
    walletAddress,
    walletConnected,
    account,
    signAndSubmitTransaction,
    signMessage,
  } = useWallet();

  function recordHistory(
    item: Omit<
      AssetHistoryItem,
      "id" | "timestamp"
    >
  ) {
    if (!walletAddress) {
      return;
    }

    try {
      const storageKey =
        `${HISTORY_PREFIX}${walletAddress}`;

      const existing =
        localStorage.getItem(
          storageKey
        );

      let history: AssetHistoryItem[] =
        [];

      if (existing) {
        try {
          const parsed =
            JSON.parse(existing);

          if (Array.isArray(parsed)) {
            history =
              parsed.filter(
                (
                  entry
                ): entry is AssetHistoryItem =>
                  Boolean(
                    entry &&
                    typeof entry ===
                      "object" &&
                    typeof entry.id ===
                      "string" &&
                    typeof entry.action ===
                      "string" &&
                    typeof entry.assetName ===
                      "string" &&
                    typeof entry.timestamp ===
                      "string"
                  )
              );
          }
        } catch {
          history = [];
        }
      }

      const nextItem: AssetHistoryItem = {
        ...item,

        id:
          `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 10)}`,

        timestamp:
          new Date().toISOString(),
      };

      const nextHistory = [
        nextItem,
        ...history,
      ].slice(
        0,
        MAX_HISTORY_ITEMS
      );

      localStorage.setItem(
        storageKey,
        JSON.stringify(nextHistory)
      );
    } catch (error) {
      /*
       * History is supplementary UI state.
       *
       * Never allow a localStorage failure
       * to break a successful Shelby operation.
       */
      console.warn(
        "Failed to record asset history:",
        error
      );
    }
  }

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

      setAssets((previous) => [
        asset,
        ...previous,
      ]);

      recordHistory({
        action: "upload",

        assetName:
          asset.name || file.name,

        assetUid:
          asset.uid,

        blobName:
          asset.blobName,

        transactionHash:
          asset.commitTransaction ||
          asset.registrationTransaction,
      });

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

      setAssets((previous) =>
        previous.filter(
          (item) =>
            item.uid !== uid
        )
      );

      recordHistory({
        action: "delete",

        assetName:
          asset.name,

        assetUid:
          asset.uid,

        blobName:
          asset.blobName,

        transactionHash:
          result.transactionHash,
      });

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
    const oldAsset =
      assets.find(
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
      const newAsset =
        await uploadDirectlyToShelby({
          file,

          walletAddress,

          walletPublicKey:
            account?.publicKey ?? null,

          signAndSubmitTransaction,

          signMessage,
        });

      const deleteResult =
        await deleteShelbyAsset({
          blobName:
            oldAsset.blobName,

          walletAddress,

          signAndSubmitTransaction,

          waitForTransaction:
            (args) =>
              aptos.waitForTransaction(
                args
              ),
        });

      setAssets((previous) =>
        previous.map((item) =>
          item.uid === uid
            ? newAsset
            : item
        )
      );

      recordHistory({
        action: "replace",

        assetName:
          newAsset.name ||
          file.name,

        assetUid:
          newAsset.uid,

        blobName:
          newAsset.blobName,

        transactionHash:
          newAsset.commitTransaction ||
          newAsset.registrationTransaction ||
          deleteResult.transactionHash,
      });

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

  const { storageUsed } = useStorageContext();

  return {
    assets,
    storageUsed,

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
