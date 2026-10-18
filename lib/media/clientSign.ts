import {
  buildSaveMessage,
  canonicalDetails,
  sha256Hex,
  type MediaDetails,
  type SaveDetailsRequest,
} from "./types";

/* Wallet adapters return signatures and keys in several shapes; normalize them. */

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

function bytesToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function signatureToBytes(signature: any): Uint8Array | null {
  if (signature instanceof Uint8Array) return signature;

  if (Array.isArray(signature)) return new Uint8Array(signature);

  if (typeof signature?.toUint8Array === "function") {
    return signature.toUint8Array();
  }

  if (signature?.data instanceof Uint8Array) return signature.data;

  if (Array.isArray(signature?.data)) return new Uint8Array(signature.data);

  if (typeof signature?.data?.toUint8Array === "function") {
    return signature.data.toUint8Array();
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function publicKeyToHex(publicKey: any): string | null {
  if (!publicKey) return null;

  if (typeof publicKey === "string") {
    return publicKey.startsWith("0x") ? publicKey : `0x${publicKey}`;
  }

  if (Array.isArray(publicKey)) {
    return publicKeyToHex(publicKey.length === 1 ? publicKey[0] : publicKey.join(""));
  }

  if (typeof publicKey.toUint8Array === "function") {
    return bytesToHex(publicKey.toUint8Array());
  }

  const text = String(publicKey);

  return text.startsWith("0x") ? text : `0x${text}`;
}

interface SignArgs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signMessage: (input: any) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any;
  owner: string;
  blobName: string;
  details: MediaDetails;
}

/**
 * Asks the connected wallet to sign "save these details for this file" and
 * returns the request body for PUT /api/media-details. The wallet shows the
 * creator a readable one-line message; nothing is sent to the chain.
 */
export async function signSaveRequest({
  signMessage,
  account,
  owner,
  blobName,
  details,
}: SignArgs): Promise<SaveDetailsRequest> {
  if (typeof signMessage !== "function") {
    throw new Error("Your wallet does not support message signing.");
  }

  const publicKey = publicKeyToHex(account?.publicKey);

  if (!publicKey) {
    throw new Error("Your wallet did not share its public key.");
  }

  const issuedAt = new Date().toISOString();

  const hash = await sha256Hex(canonicalDetails(owner, blobName, details));

  const message = buildSaveMessage(blobName, hash, issuedAt);

  const nonce = bytesToHex(crypto.getRandomValues(new Uint8Array(8))).slice(2);

  const signed = await signMessage({ message, nonce });

  const bytes = signatureToBytes(signed?.signature);

  if (!bytes) {
    throw new Error("Your wallet did not return a signature.");
  }

  return {
    owner,
    blobName,
    title: details.title,
    description: details.description,
    coverBlob: details.coverBlob,
    issuedAt,
    publicKey,
    signature: bytesToBase64(bytes),
    fullMessage:
      typeof signed?.fullMessage === "string"
        ? signed.fullMessage
        : `APTOS\nmessage: ${message}\nnonce: ${nonce}`,
  };
}
