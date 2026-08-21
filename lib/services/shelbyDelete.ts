"use client";

import {
  ShelbyBlobClient,
} from "@shelby-protocol/sdk/browser";

import type {
  AccountAddressInput,
  InputGenerateTransactionPayloadData,
} from "@aptos-labs/ts-sdk";

export interface DeleteShelbyAssetParams {
  blobName: string;
  walletAddress: AccountAddressInput;

  signAndSubmitTransaction: (args: {
    sender: AccountAddressInput;
    data: InputGenerateTransactionPayloadData;
  }) => Promise<{
    hash?: string;
  }>;

  waitForTransaction: (args: {
    transactionHash: string;
  }) => Promise<{
    success?: boolean;
    vm_status?: string;
  }>;
}

export async function deleteShelbyAsset({
  blobName,
  walletAddress,
  signAndSubmitTransaction,
  waitForTransaction,
}: DeleteShelbyAssetParams) {
  const normalizedBlobName = blobName?.trim();

  if (!normalizedBlobName) {
    throw new Error("Shelby blob name is missing.");
  }

  if (!walletAddress) {
    throw new Error(
      "Connect your wallet before deleting an asset."
    );
  }

  /*
   * The blob name MUST be the Shelby suffix only.
   *
   * Example:
   * shelby-studio/uuid/file.png
   *
   * NOT:
   * 0xowner/shelby-studio/uuid/file.png
   */
  const payload =
    ShelbyBlobClient.createDeleteObjectPayload({
      blobName: normalizedBlobName,
    });

  const result =
    await signAndSubmitTransaction({
      sender: walletAddress,
      data: payload,
    });

  const transactionHash = result?.hash;

  if (!transactionHash) {
    throw new Error(
      "Wallet did not return a Shelby deletion transaction hash."
    );
  }

  const response =
    await waitForTransaction({
      transactionHash,
    });

  if (!response?.success) {
    throw new Error(
      `Shelby deletion failed: ${
        response?.vm_status ??
        "Transaction was not successful."
      }`
    );
  }

  return {
    transactionHash,
  };
}
