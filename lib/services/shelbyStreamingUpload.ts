import {
  Account,
  Ed25519PrivateKey,
  Network,
} from "@aptos-labs/ts-sdk";

import {
  ShelbyClient,
  ShelbyBlobClient,
  createDefaultErasureCodingProvider,
  generateCommitments,
  requiredAckCount,
} from "@shelby-protocol/sdk/node";

export interface StreamingUploadProgress {
  phase:
    | "preparing"
    | "commitments"
    | "registering"
    | "uploading"
    | "committing"
    | "complete";

  uploadedBytes: number;
  totalBytes: number;
  percentage: number;

  chunksetIdx?: number;
  totalChunksets?: number;
}

interface StreamingUploadOptions {
  file: File;

  onProgress?: (
    progress: StreamingUploadProgress
  ) => void;
}

export async function streamUploadToShelby({
  file,
  onProgress,
}: StreamingUploadOptions) {
  /*
   * Server-only Shelby credentials.
   */
  const privateKey =
    process.env.SHELBY_SIGNER_PRIVATE_KEY;

  const apiKey =
    process.env.SHELBY_API_KEY;

  if (!privateKey) {
    throw new Error(
      "Shelby signer is not configured."
    );
  }

  if (!apiKey) {
    throw new Error(
      "Shelby API key is not configured."
    );
  }

  if (file.size === 0) {
    throw new Error(
      "The selected file is empty."
    );
  }

  /*
   * Recreate the persistent Shelby Studio
   * server signer.
   */
  const signer =
    Account.fromPrivateKey({
      privateKey:
        new Ed25519PrivateKey(
          privateKey
        ),
    });

  /*
   * Real Shelby client targeting
   * the Shelbynet development network.
   */
  const shelbyClient =
    new ShelbyClient({
      network: Network.SHELBYNET,
      apiKey,
      locationHint: "shelbynet-1",
    });

  /*
   * Shelby's deployer address is required
   * when parsing Shelby protocol events.
   *
   * The SDK types this value as optional,
   * so validate it once here.
   */
  const deployer =
    shelbyClient.config.deployer;

  if (!deployer) {
    throw new Error(
      "Shelby deployer address is not configured for Shelbynet."
    );
  }

  /*
   * Shelby's default erasure coding
   * configuration.
   */
  const provider =
    await createDefaultErasureCodingProvider();

  /*
   * Every upload gets a unique path.
   *
   * This prevents duplicate filenames
   * from colliding.
   */
  const blobName =
    `shelby-studio/${crypto.randomUUID()}/${file.name}`;

  /*
   * Keep uploaded blobs for 30 days.
   */
  const expirationMicros =
    Date.now() * 1000 +
    30 *
      24 *
      60 *
      60 *
      1_000_000;

  /*
   * STEP 1
   *
   * Generate commitments from a stream.
   *
   * The complete file is NOT converted
   * into one large Uint8Array.
   */
  onProgress?.({
    phase: "commitments",
    uploadedBytes: 0,
    totalBytes: file.size,
    percentage: 0,
  });

  const commitmentStream =
    file.stream();

  const commitments =
    await generateCommitments(
      provider,
      commitmentStream
    );

  /*
   * Make sure Shelby generated
   * commitments for the entire file.
   */
  if (
    commitments.raw_data_size !==
    file.size
  ) {
    throw new Error(
      "Commitment size does not match file size."
    );
  }

  /*
   * STEP 2
   *
   * Register the pending blob
   * on Shelbynet.
   */
  onProgress?.({
    phase: "registering",
    uploadedBytes: 0,
    totalBytes: file.size,
    percentage: 0,
  });

  const {
    transaction:
      pendingRegisterTransaction,
  } =
    await shelbyClient.coordination.registerBlob(
      {
        account: signer,

        blobName,

        blobMerkleRoot:
          commitments.blob_merkle_root,

        size: file.size,

        expirationMicros,

        config: provider.config,
      }
    );

  /*
   * Wait for registration to land
   * on-chain.
   */
  const registerTx =
    await shelbyClient.aptos.waitForTransaction(
      {
        transactionHash:
          pendingRegisterTransaction.hash,
      }
    );

  if (!registerTx.success) {
    throw new Error(
      `Shelby blob registration failed: ${registerTx.vm_status}`
    );
  }

  /*
   * Aptos can return several committed
   * transaction response types.
   *
   * Not every type contains events.
   */
  if (!("events" in registerTx)) {
    throw new Error(
      "Shelby registration transaction did not contain events."
    );
  }

  /*
   * STEP 3
   *
   * Extract the real Shelby blob UID
   * emitted by BlobRegisteredEvent.
   */
  const registered =
    ShelbyBlobClient.registeredBlobUids(
      registerTx.events,
      deployer
    );

  const expectedObjectName =
    `@${signer.accountAddress.toString()}/${blobName}`;

  const registeredBlob =
    registered.find(
      (entry) =>
        entry.objectName ===
        expectedObjectName
    ) ?? registered[0];

  if (!registeredBlob) {
    throw new Error(
      "Shelby registration succeeded but no blob UID was emitted."
    );
  }

  const uid =
    registeredBlob.uid;

  /*
   * STEP 4
   *
   * Upload the actual file data.
   *
   * file.stream() gives us a fresh stream.
   *
   * The commitment stream above has
   * already been consumed.
   */
  onProgress?.({
    phase: "uploading",
    uploadedBytes: 0,
    totalBytes: file.size,
    percentage: 0,
  });

  const uploadStream =
    file.stream();

  const { spAcks } =
    await shelbyClient.rpc.putBlobChunksets(
      {
        account: signer,

        uid,

        blobData: uploadStream,

        commitments,

        totalBytes: file.size,

        /*
         * Upload several chunksets
         * concurrently.
         */
        chunksetConcurrency: 4,

        /*
         * Real upload progress coming
         * from the Shelby SDK.
         */
        onProgress(progress) {
          const percentage =
            progress.totalBytes > 0
              ? Math.min(
                  100,
                  Math.round(
                    (progress.uploadedBytes /
                      progress.totalBytes) *
                      100
                  )
                )
              : 0;

          onProgress?.({
            phase: "uploading",

            uploadedBytes:
              progress.uploadedBytes,

            totalBytes:
              progress.totalBytes,

            percentage,

            chunksetIdx:
              progress.chunksetIdx,

            totalChunksets:
              progress.totalChunksets,
          });
        },
      }
    );

  /*
   * STEP 5
   *
   * Make sure enough Shelby Storage
   * Providers acknowledged the upload.
   */
  const requiredAcks =
    requiredAckCount(
      provider.config.erasure_n
    );

  if (
    spAcks.length <
    requiredAcks
  ) {
    throw new Error(
      `Insufficient Shelby storage provider acknowledgements. Received ${spAcks.length}, required ${requiredAcks}.`
    );
  }

  /*
   * STEP 6
   *
   * Finalize the object on-chain.
   */
  onProgress?.({
    phase: "committing",
    uploadedBytes: file.size,
    totalBytes: file.size,
    percentage: 100,
  });

  const {
    transaction:
      pendingCommitTransaction,
  } =
    await shelbyClient.coordination.commitObject(
      {
        account: signer,

        uid,

        blobName,

        overwrite: true,

        storageProviderAcks:
          spAcks,
      }
    );

  /*
   * Wait for the final commit transaction.
   */
  const commitTx =
    await shelbyClient.aptos.waitForTransaction(
      {
        transactionHash:
          pendingCommitTransaction.hash,
      }
    );

  if (!commitTx.success) {
    throw new Error(
      `Shelby object commit failed: ${commitTx.vm_status}`
    );
  }

  /*
   * Make sure the finalized transaction
   * contains events before parsing them.
   */
  if (!("events" in commitTx)) {
    throw new Error(
      "Shelby commit transaction did not contain events."
    );
  }

  /*
   * Shelby commit_object can technically
   * have a successful transaction while
   * rejecting the object.
   *
   * Check Shelby's events to make sure
   * that did not happen.
   */
  const rejection =
    ShelbyBlobClient.findObjectCommitRejection(
      commitTx.events,
      deployer,
      uid
    );

  if (rejection) {
    throw new Error(
      `Shelby rejected the object commit: ${String(
        rejection
      )}`
    );
  }

  /*
   * The file is now registered,
   * uploaded and committed.
   */
  onProgress?.({
    phase: "complete",
    uploadedBytes: file.size,
    totalBytes: file.size,
    percentage: 100,
  });

  /*
   * Return the real Shelby asset
   * information to Shelby Studio.
   */
  return {
    uid:
      uid.toString(),

    name:
      file.name,

    blobName,

    size:
      file.size,

    uploadedAt:
      new Date().toISOString(),

    network:
      "Shelbynet",

    status:
      "Stored" as const,

    owner:
      signer.accountAddress.toString(),

    registrationTransaction:
      pendingRegisterTransaction.hash,

    commitTransaction:
      pendingCommitTransaction.hash,
  };
}