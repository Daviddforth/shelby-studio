import "server-only";

import {
  AccountAddress,
  AnyPublicKey,
  AuthenticationKey,
  Ed25519PublicKey,
  Ed25519Signature,
} from "@aptos-labs/ts-sdk";

import {
  SIGNATURE_MAX_AGE_MS,
  buildSaveMessage,
  canonicalDetails,
  sha256Hex,
  type SaveDetailsRequest,
} from "./types";

export class SignatureError extends Error {
  status = 401;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;

  if (!/^([0-9a-fA-F]{2})+$/.test(clean)) {
    throw new SignatureError("Invalid public key.");
  }

  return Uint8Array.from(
    clean.match(/../g)!.map((byte) => Number.parseInt(byte, 16))
  );
}

/** Accepts a plain 32-byte Ed25519 key, or the same key wrapped as a single-key account key. */
function rawEd25519Key(bytes: Uint8Array): Uint8Array {
  if (bytes.length === 32) return bytes;

  // Single-key wrapper: [variant 0x00][length 0x20][32 key bytes]
  if (bytes.length === 34 && bytes[0] === 0 && bytes[1] === 32) {
    return bytes.slice(2);
  }

  throw new SignatureError("Unsupported public key type.");
}

function rawSignature(bytes: Uint8Array): Uint8Array {
  if (bytes.length === 64) return bytes;

  // Single-key wrapper: [variant 0x00][length 0x40][64 signature bytes]
  if (bytes.length === 66 && bytes[0] === 0 && bytes[1] === 64) {
    return bytes.slice(2);
  }

  throw new SignatureError("Unsupported signature format.");
}

/** True when `owner` is the address derived from this key (either account scheme). */
function keyControlsAddress(key: Ed25519PublicKey, owner: string): boolean {
  const target = AccountAddress.fromString(owner).toString();

  const legacy = AuthenticationKey.fromPublicKey({
    publicKey: key,
  })
    .derivedAddress()
    .toString();

  const single = AuthenticationKey.fromPublicKey({
    publicKey: new AnyPublicKey(key),
  })
    .derivedAddress()
    .toString();

  return target === legacy || target === single;
}

/** What a wallet sends to prove it signed one specific message. */
export interface WalletProof {
  owner: string;
  issuedAt: string;
  publicKey: string;
  /** Base64 signature bytes. */
  signature: string;
  fullMessage: string;
}

/**
 * Verifies that the owner's wallet signed exactly `expectedMessage`.
 *
 * Checks, in order: the request is fresh, the signed text contains the
 * expected message, the key really controls the owner address, and the
 * signature is valid. Used for every wallet-signed action (saving details,
 * going live), so each action gets the same protection.
 */
export async function verifyWalletMessage(
  proof: WalletProof,
  expectedMessage: string,
  now: number = Date.now(),
  maxAgeMs: number = SIGNATURE_MAX_AGE_MS
): Promise<void> {
  const issued = Date.parse(proof.issuedAt);

  if (
    !Number.isFinite(issued) ||
    now - issued > maxAgeMs ||
    issued - now > 60_000
  ) {
    throw new SignatureError(
      "The signed request has expired. Please try again."
    );
  }

  if (
    typeof proof.fullMessage !== "string" ||
    !proof.fullMessage.includes(expectedMessage)
  ) {
    throw new SignatureError("The signed message does not match this request.");
  }

  const request = proof;

  let key: Ed25519PublicKey;
  let signature: Ed25519Signature;

  try {
    key = new Ed25519PublicKey(rawEd25519Key(hexToBytes(request.publicKey)));

    signature = new Ed25519Signature(
      rawSignature(
        Uint8Array.from(Buffer.from(request.signature, "base64"))
      )
    );
  } catch (error) {
    if (error instanceof SignatureError) throw error;

    throw new SignatureError("Invalid signature data.");
  }

  if (!keyControlsAddress(key, request.owner)) {
    throw new SignatureError(
      "This wallet key does not control the owner address."
    );
  }

  const valid = key.verifySignature({
    message: new TextEncoder().encode(request.fullMessage),
    signature,
  });

  if (!valid) {
    throw new SignatureError("The wallet signature is not valid.");
  }
}

/**
 * Verifies that the owner's wallet signed this exact "save details" request:
 * the signed text binds the file and a hash of the new details.
 */
export async function verifySaveRequest(
  request: SaveDetailsRequest,
  now: number = Date.now()
): Promise<void> {
  const hash = await sha256Hex(
    canonicalDetails(request.owner, request.blobName, {
      title: request.title,
      description: request.description,
      coverBlob: request.coverBlob,
    })
  );

  await verifyWalletMessage(
    request,
    buildSaveMessage(request.blobName, hash, request.issuedAt),
    now
  );
}
