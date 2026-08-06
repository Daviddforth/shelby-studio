"use client";

import {
  createDefaultErasureCodingProvider,
  generateCommitments,
  ShelbyBlobClient,
} from "@shelby-protocol/sdk/browser";

import {
  AccountAddress,
} from "@aptos-labs/ts-sdk";

import type {
  LargeUploadProgress,
} from "@/lib/services/shelbyLargeUpload";

import type {
  UploadedAsset,
} from "@/lib/services/storage";

/*
 * JSON-safe version of Shelby's
 * StorageProviderAck.
 *
 * finalize-upload converts signature
 * back into Uint8Array.
 */
interface SerializedStorageProviderAck {
  slot: number;
  signature: number[];
}

interface PrepareUploadResponse {
  success: boolean;

  error?: string;

  preparation?: {
    blobName: string;
    owner: string;
    size: number;
    totalChunksets: number;
    expirationMicros: number;
    transactionPayload: any;
  };
}

interface FinalizeUploadResponse {
  success: boolean;

  error?: string;

  commit?: {
    uid: string;
    blobName: string;
    transactionPayload: any;
  };
}

interface ShelbyChunksetResponse {
  success?: boolean;

  acksReceived?: number;

  spAcks?: Array<{
    slot: number;
    signature: string;
  }>;
}

interface DirectUploadOptions {
  file: File;

  /*
   * Connected Aptos wallet.
   *
   * The connected user wallet will be used
   * for Shelby on-chain transactions.
   */
  walletAddress: string;

  signAndSubmitTransaction: (
    transaction: any
  ) => Promise<any>;

  signMessage?: (
    message: any
  ) => Promise<any>;

  onProgress?: (
    progress: LargeUploadProgress
  ) => void;
}

/*
 * Shelby Shelbynet RPC.
 *
 * Large file bytes go directly from
 * the browser to this RPC instead of
 * passing through our Next.js server.
 */
const SHELBY_RPC_BASE_URL =
  "https://shelby.shelbynet.shelby.xyz/shelby";

/*
 * Convert a hexadecimal string into
 * its raw byte representation.
 */
function hexToBytes(
  value: string
): Uint8Array {
  const normalized =
    value.startsWith("0x")
      ? value.slice(2)
      : value;

  if (
    normalized.length % 2 !==
    0
  ) {
    throw new Error(
      "Invalid Shelby hex value."
    );
  }

  const result =
    new Uint8Array(
      normalized.length / 2
    );

  for (
    let index = 0;
    index < normalized.length;
    index += 2
  ) {
    const byte =
      Number.parseInt(
        normalized.slice(
          index,
          index + 2
        ),
        16
      );

    if (
      Number.isNaN(byte)
    ) {
      throw new Error(
        "Invalid Shelby hex value."
      );
    }

    result[index / 2] =
      byte;
  }

  return result;
}

/*
 * SHA-256 two Merkle tree nodes.
 *
 * This mirrors Shelby SDK's
 * internal concatHashes() behavior.
 */
async function hashPair(
  left: Uint8Array,
  right: Uint8Array
): Promise<Uint8Array> {
  const combined =
    new Uint8Array(
      left.length +
        right.length
    );

  combined.set(
    left,
    0
  );

  combined.set(
    right,
    left.length
  );

  const digest =
    await crypto.subtle.digest(
      "SHA-256",
      combined
    );

  return new Uint8Array(
    digest
  );
}

/*
 * Browser implementation of Shelby's
 * internal:
 *
 * generateChunksetInclusionProof()
 *
 * The currently installed Shelby SDK
 * contains this helper internally but
 * does not expose it through the public
 * browser exports.
 */
async function generateChunksetInclusionProof(
  chunksetRoots: Uint8Array[],
  chunksetIndex: number
): Promise<Uint8Array[]> {
  if (
    chunksetRoots.length === 0
  ) {
    throw new Error(
      "Cannot generate inclusion proof for empty chunkset roots."
    );
  }

  if (
    chunksetIndex < 0 ||
    chunksetIndex >=
      chunksetRoots.length
  ) {
    throw new Error(
      `Chunkset index ${chunksetIndex} is out of range.`
    );
  }

  if (
    chunksetRoots.length === 1
  ) {
    return [];
  }

  const zeroHash: Uint8Array =
    new Uint8Array(32);

  const siblings:
    Uint8Array[] = [];

  let currentLeaves: Uint8Array[] =
    chunksetRoots.map(
      (root) =>
        new Uint8Array(
          root
        )
    );

  let currentIndex =
    chunksetIndex;

  while (
    currentLeaves.length > 1
  ) {
    if (
      currentLeaves.length %
        2 !==
      0
    ) {
      currentLeaves.push(
        zeroHash
      );
    }

    const siblingIndex =
      currentIndex % 2 === 0
        ? currentIndex + 1
        : currentIndex - 1;

    const sibling =
      currentLeaves[
        siblingIndex
      ];

    if (!sibling) {
      throw new Error(
        "Shelby inclusion proof sibling is missing."
      );
    }

    siblings.push(
      sibling
    );

    const nextLeaves:
      Uint8Array[] = [];

    for (
      let index = 0;
      index <
      currentLeaves.length;
      index += 2
    ) {
      const left =
        currentLeaves[index];

      const right =
        currentLeaves[
          index + 1
        ];

      if (
        !left ||
        !right
      ) {
        throw new Error(
          "Invalid Shelby Merkle tree."
        );
      }

      nextLeaves.push(
        await hashPair(
          left,
          right
        )
      );
    }

    currentLeaves =
      nextLeaves;

    currentIndex =
      Math.floor(
        currentIndex / 2
      );
  }

  return siblings;
}

/*
 * Exact encoding used by Shelby's
 * internal encodeInclusionProof().
 */
function encodeInclusionProof(
  siblings: Uint8Array[]
): string {
  if (
    siblings.length === 0
  ) {
    return "NONE";
  }

  const combined =
    new Uint8Array(
      siblings.length * 32
    );

  let offset = 0;

  for (
    const sibling
    of siblings
  ) {
    combined.set(
      sibling,
      offset
    );

    offset += 32;
  }

  let binaryString =
    "";

  for (
    const byte
    of combined
  ) {
    binaryString +=
      String.fromCharCode(
        byte
      );
  }

  return btoa(
    binaryString
  );
}

/*
 * Convert Shelby's Base64 Storage
 * Provider signature into a normal
 * number array so it can safely be
 * sent through JSON.
 */
function base64ToNumberArray(
  value: string
): number[] {
  const binary =
    atob(value);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let index = 0;
    index < binary.length;
    index++
  ) {
    bytes[index] =
      binary.charCodeAt(
        index
      );
  }

  return Array.from(
    bytes
  );
}

function calculatePercentage(
  uploadedBytes: number,
  totalBytes: number
): number {
  if (
    totalBytes <= 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (uploadedBytes /
        totalBytes) *
        100
    )
  );
}

/*
 * LARGE-FILE DIRECT SHELBY UPLOAD
 */
export async function uploadDirectlyToShelby({
  file,
  walletAddress,
  signAndSubmitTransaction,
  signMessage,
  onProgress,
}: DirectUploadOptions): Promise<UploadedAsset> {
  if (
    file.size <= 0
  ) {
    throw new Error(
      "The selected file is empty."
    );
  }

  if (!walletAddress) {
    throw new Error(
      "Connect your wallet before uploading to Shelby."
    );
  }

  if (
    typeof signAndSubmitTransaction !==
    "function"
  ) {
    throw new Error(
      "The connected wallet cannot sign Shelby transactions."
    );
  }

  /*
   * STEP 1
   *
   * Generate Shelby commitments
   * locally in the browser.
   */
  onProgress?.({
    phase: "preparing",
    uploadedBytes: 0,
    totalBytes: file.size,
    percentage: 0,
  });

  const provider =
    await createDefaultErasureCodingProvider();

  const commitments =
    await generateCommitments(
      provider,
      file.stream()
    );

  if (
    commitments.raw_data_size !==
    file.size
  ) {
    throw new Error(
      "Shelby commitment size does not match the selected file."
    );
  }

  /*
   * STEP 2
   *
   * Ask our server to BUILD the Shelby
   * registration payload.
   *
   * The server does NOT sign it.
   */
  onProgress?.({
    phase: "registering",
    uploadedBytes: 0,
    totalBytes: file.size,
    percentage: 0,
  });

  const totalChunksets =
    commitments
      .chunkset_commitments
      .length;

  if (
    totalChunksets <= 0
  ) {
    throw new Error(
      "Shelby generated no chunksets for the selected file."
    );
  }

  const prepareResponse =
    await fetch(
      "/api/storage/prepare-upload",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          fileName:
            file.name,

          size:
            file.size,

          blobMerkleRoot:
            commitments.blob_merkle_root,

          walletAddress,

          totalChunksets,
        }),
      }
    );

  let prepareResult:
    PrepareUploadResponse;

  try {
    prepareResult =
      (await prepareResponse.json()) as
        PrepareUploadResponse;
  } catch {
    throw new Error(
      `Shelby prepare-upload returned an invalid response (${prepareResponse.status}).`
    );
  }

  if (
    !prepareResponse.ok ||
    !prepareResult.success ||
    !prepareResult.preparation
  ) {
    throw new Error(
      prepareResult.error ??
        "Shelby Studio could not prepare the registration transaction."
    );
  }

  const preparation =
    prepareResult.preparation;

  /*
   * IMPORTANT:
   *
   * THIS is where the connected wallet
   * signs and submits the Shelby
   * registration transaction.
   *
   * Therefore the connected wallet is
   * the transaction sender and pays gas.
   */
  console.log(
    "SHELBY REGISTRATION PAYLOAD:",
    preparation.transactionPayload
  );

  const registrationPayload = {
    ...preparation.transactionPayload,

    typeArguments:
      preparation.transactionPayload
        .typeArguments ?? [],
  };

  console.log(
    "SHELBY NORMALIZED REGISTRATION PAYLOAD:",
    registrationPayload
  );

  const registrationResult =
    await signAndSubmitTransaction({
      data:
        registrationPayload,
    });

  const registrationHash =
    registrationResult?.hash;

  if (!registrationHash) {
    throw new Error(
      "The connected wallet did not return a Shelby registration transaction hash."
    );
  }

  /*
   * Wait for the wallet transaction to
   * become available through Shelbynet.
   */
  const registrationResponse =
    await fetch(
      `https://api.shelbynet.shelby.xyz/v1/transactions/by_hash/${encodeURIComponent(
        registrationHash
      )}`,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.NEXT_PUBLIC_SHELBY_BROWSER_API_KEY}`,
        },
      }
    );

  if (!registrationResponse.ok) {
    const errorText =
      await registrationResponse.text();

    throw new Error(
      `Could not read Shelby registration transaction (${registrationResponse.status}): ${errorText}`
    );
  }

  const registrationTransaction =
    await registrationResponse.json();

  if (
    registrationTransaction?.success ===
    false
  ) {
    throw new Error(
      `Shelby registration transaction failed: ${
        registrationTransaction?.vm_status ??
        "Unknown transaction failure."
      }`
    );
  }

  const registrationEvents =
    Array.isArray(
      registrationTransaction?.events
    )
      ? registrationTransaction.events
      : [];

  /*
   * Extract the UID emitted by the
   * wallet's BlobRegisteredEvent.
   */
  let registeredUid:
    string | null = null;

  for (
    const event
    of registrationEvents
  ) {
    if (
      typeof event?.type !== "string" ||
      !event.type.includes(
        "BlobRegisteredEvent"
      )
    ) {
      continue;
    }

    const rawUid =
      event?.data?.uid ??
      event?.data?.blob_uid;

    if (
      rawUid !== undefined &&
      rawUid !== null
    ) {
      registeredUid =
        String(rawUid);

      break;
    }
  }

  if (!registeredUid) {
    throw new Error(
      "Shelby registration succeeded but no blob UID was emitted."
    );
  }

  /*
   * From this point onward the Shelby
   * object belongs to walletAddress.
   */
  const prepared = {
    uid:
      registeredUid,

    blobName:
      preparation.blobName,

    owner:
      preparation.owner,

    registrationTransaction:
      registrationHash,
  };

  /*
   * Shelby Storage authentication must
   * belong to the SAME connected wallet
   * that registered the blob.
   */
  if (
    typeof signMessage !==
    "function"
  ) {
    throw new Error(
      "The connected wallet does not support message signing required by Shelby Storage."
    );
  }

  /*
   * Request Shelby's challenge for the
   * connected wallet.
   */
  const challengeResponse =
    await fetch(
      `${SHELBY_RPC_BASE_URL}/v1/challenge/${encodeURIComponent(
        walletAddress
      )}`,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.NEXT_PUBLIC_SHELBY_BROWSER_API_KEY}`,
        },
      }
    );

  if (!challengeResponse.ok) {
    const errorText =
      await challengeResponse.text();

    throw new Error(
      `Could not get Shelby wallet challenge (${challengeResponse.status}): ${errorText}`
    );
  }

  const challengeResult =
    await challengeResponse.json();

  const challenge =
    challengeResult?.challenge;

  if (
    typeof challenge !== "string" ||
    !challenge
  ) {
    throw new Error(
      "Shelby returned an invalid wallet challenge."
    );
  }

  /*
   * Ask the connected wallet to sign
   * Shelby's challenge.
   *
   * No Shelby Studio private key is used.
   */
  const signedMessage =
    await signMessage({
      message:
        challenge,

      nonce:
        "shelby-studio",
    });

  const signature =
    signedMessage?.signature;

  const publicKey =
    signedMessage?.publicKey ??
    signedMessage?.public_key;

  if (!signature) {
    throw new Error(
      "The connected wallet did not return a Shelby authentication signature."
    );
  }

  if (!publicKey) {
    throw new Error(
      "The connected wallet did not return its public key for Shelby authentication."
    );
  }

  /*
   * Normalize wallet-adapter return
   * values into strings for HTTP headers.
   */
  const signatureString =
    typeof signature === "string"
      ? signature
      : Array.isArray(signature)
        ? btoa(
            String.fromCharCode(
              ...signature
            )
          )
        : String(signature);

  const publicKeyString =
    typeof publicKey === "string"
      ? publicKey
      : Array.isArray(publicKey)
        ? `0x${publicKey
            .map((byte: number) =>
              byte
                .toString(16)
                .padStart(2, "0")
            )
            .join("")}`
        : String(publicKey);

  const walletAuth = {
    challenge,

    signature:
      signatureString,

    publicKey:
      publicKeyString,

    authScheme:
      "ed25519",
  };

  /*
   * STEP 3
   *
   * Determine chunkset size.
   */
  const chunksetSize =
    provider.config.chunkSizeBytes *
    provider.config.erasure_k;

  const chunksetRoots: Uint8Array[] =
    commitments
      .chunkset_commitments
      .map(
        (entry) =>
          hexToBytes(
            entry.chunkset_root
          )
      );

  const ackMap =
    new Map<
      number,
      SerializedStorageProviderAck
    >();

  let uploadedBytes =
    0;

  /*
   * STEP 4
   *
   * Upload each chunkset DIRECTLY
   * from browser to Shelby.
   */
  for (
    let chunksetIndex = 0;
    chunksetIndex <
    totalChunksets;
    chunksetIndex++
  ) {
    const start =
      chunksetIndex *
      chunksetSize;

    const end =
      Math.min(
        start +
          chunksetSize,
        file.size
      );

    const chunksetBlob =
      file.slice(
        start,
        end
      );

    const chunksetData =
      new Uint8Array(
        await chunksetBlob.arrayBuffer()
      );

    const siblings =
      await generateChunksetInclusionProof(
        chunksetRoots,
        chunksetIndex
      );

    const inclusionProof =
      encodeInclusionProof(
        siblings
      );

    const url =
      `${SHELBY_RPC_BASE_URL}` +
      `/v2/chunksets/` +
      `${encodeURIComponent(
        prepared.owner
      )}/` +
      `${chunksetIndex}/` +
      `${encodeURIComponent(
        prepared.uid
      )}`;

    const response =
      await fetch(
        url,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/octet-stream",

            Authorization:
              `Bearer ${process.env.NEXT_PUBLIC_SHELBY_BROWSER_API_KEY}`,

            "X-Shelby-Challenge":
              walletAuth
                .challenge,

            "X-Shelby-Signature":
              walletAuth
                .signature,

            "X-Shelby-Public-Key":
              walletAuth
                .publicKey,

            "X-Shelby-Auth-Scheme":
              walletAuth
                .authScheme,

            "X-Shelby-Inclusion-Proof":
              inclusionProof,
          },

          body:
            chunksetData,
        }
      );

    if (
      !response.ok
    ) {
      const errorText =
        await response.text();

      throw new Error(
        `Shelby chunkset ${chunksetIndex + 1}/${totalChunksets} upload failed (${response.status}): ${errorText}`
      );
    }

    let result:
      ShelbyChunksetResponse;

    try {
      result =
        (await response.json()) as
          ShelbyChunksetResponse;
    } catch {
      throw new Error(
        `Shelby returned an invalid response for chunkset ${chunksetIndex + 1}/${totalChunksets}.`
      );
    }

    if (
      result.success === false
    ) {
      throw new Error(
        `Shelby rejected chunkset ${chunksetIndex + 1}/${totalChunksets}.`
      );
    }

    for (
      const ack
      of result.spAcks ?? []
    ) {
      ackMap.set(
        ack.slot,
        {
          slot:
            ack.slot,

          signature:
            base64ToNumberArray(
              ack.signature
            ),
        }
      );
    }

    uploadedBytes +=
      chunksetData.byteLength;

    onProgress?.({
      phase: "uploading",

      uploadedBytes,

      totalBytes:
        file.size,

      percentage:
        calculatePercentage(
          uploadedBytes,
          file.size
        ),

      chunksetIdx:
        chunksetIndex,

      totalChunksets,
    });
  }

  const spAcks =
    Array.from(
      ackMap.values()
    );

  if (
    spAcks.length === 0
  ) {
    throw new Error(
      "Shelby upload completed without storage provider acknowledgements."
    );
  }

  /*
   * STEP 5
   *
   * Prepare the Shelby commit_object
   * transaction.
   *
   * The server ONLY builds the payload.
   * It does not sign or submit it.
   */
  onProgress?.({
    phase: "committing",
    uploadedBytes:
      file.size,
    totalBytes:
      file.size,
    percentage: 100,
  });

  const finalizeResponse =
    await fetch(
      "/api/storage/finalize-upload",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          uid:
            prepared.uid,

          blobName:
            prepared.blobName,

          spAcks,
        }),
      }
    );

  let finalizeResult:
    FinalizeUploadResponse;

  try {
    finalizeResult =
      (await finalizeResponse.json()) as
        FinalizeUploadResponse;
  } catch {
    throw new Error(
      `Shelby finalize-upload returned an invalid response (${finalizeResponse.status}).`
    );
  }

  if (
    !finalizeResponse.ok ||
    !finalizeResult.success ||
    !finalizeResult.commit
  ) {
    throw new Error(
      finalizeResult.error ??
        "Shelby Studio could not prepare the final commit transaction."
    );
  }

  /*
   * IMPORTANT:
   *
   * The CONNECTED WALLET signs and
   * submits commit_object.
   *
   * Therefore the connected wallet is
   * the sender and pays this transaction's
   * gas — NOT Shelby Studio's server key.
   */
  const commitResult =
    await signAndSubmitTransaction({
      data:
        finalizeResult
          .commit
          .transactionPayload,
    });

  const commitTransaction =
    commitResult?.hash;

  if (!commitTransaction) {
    throw new Error(
      "The connected wallet did not return a Shelby commit transaction hash."
    );
  }

  /*
   * At this point the wallet accepted
   * and submitted the final Shelby
   * commit transaction.
   */
  onProgress?.({
    phase: "complete",
    uploadedBytes:
      file.size,
    totalBytes:
      file.size,
    percentage: 100,
  });

  return {
    uid:
      prepared.uid,

    name:
      file.name,

    blobName:
      prepared.blobName,

    size:
      file.size,

    uploadedAt:
      new Date().toISOString(),

    network:
      "Shelbynet",

    status:
      "Stored",

    owner:
      prepared.owner,
  };
}
