/**
 * Browser-side encryption for paid files. AES-256-GCM. The stored file is
 * IV (12 bytes) followed by the encrypted bytes. Works in browsers and Node.
 */

const toBase64 = (bytes: Uint8Array) => btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));

const fromBase64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

export async function generateFileKey(): Promise<string> {
  return toBase64(crypto.getRandomValues(new Uint8Array(32)));
}

async function importKey(keyB64: string) {
  const raw = fromBase64(keyB64);

  if (raw.length !== 32) throw new Error("Invalid key.");

  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptBytes(data: ArrayBuffer, keyB64: string): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await importKey(keyB64), data));

  const out = new Uint8Array(iv.length + encrypted.length);

  out.set(iv, 0);
  out.set(encrypted, iv.length);

  return out;
}

export async function decryptBytes(data: ArrayBuffer, keyB64: string): Promise<ArrayBuffer> {
  if (data.byteLength < 13) throw new Error("This file is not a locked file.");

  const bytes = new Uint8Array(data);

  try {
    return await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, await importKey(keyB64), bytes.slice(12));
  } catch {
    throw new Error("Could not unlock the file. The key does not match.");
  }
}
