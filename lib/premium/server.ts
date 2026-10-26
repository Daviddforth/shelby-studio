import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

import { docs, safeDocs } from "@/lib/store/docs";

import type { PremiumInfo } from "./types";

/**
 * Paid files. The file is encrypted in the creator's browser before it reaches
 * Shelby, so the public copy is unreadable. The key is kept here, locked with
 * PREMIUM_KEY_SECRET, and handed only to the creator and to wallets that paid.
 */

export function premiumEnabled(): boolean {
  return Boolean(process.env.PREMIUM_KEY_SECRET && process.env.PREMIUM_KEY_SECRET.length >= 16);
}

function masterKey(): Buffer {
  const secret = process.env.PREMIUM_KEY_SECRET;

  if (!secret || secret.length < 16) throw new Error("Paid files are not set up on this server yet.");

  return createHash("sha256").update(`shelby-studio-premium:${secret}`).digest();
}

export function sealKey(keyB64: string): string {
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", masterKey(), iv);

  const sealed = Buffer.concat([cipher.update(keyB64, "utf8"), cipher.final()]);

  return Buffer.concat([iv, cipher.getAuthTag(), sealed]).toString("base64");
}

export function openKey(sealed: string): string {
  const raw = Buffer.from(sealed, "base64");

  const decipher = createDecipheriv("aes-256-gcm", masterKey(), raw.subarray(0, 12));

  decipher.setAuthTag(raw.subarray(12, 28));

  return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
}

interface PremiumDoc extends PremiumInfo {
  sealedKey: string;
}

export async function getPremium(owner: string, blobName: string): Promise<PremiumInfo | null> {
  const doc = await safeDocs.get<PremiumDoc>("premium", owner, blobName);

  return doc ? { priceOctas: doc.data.priceOctas } : null;
}

/** Price of every paid file a creator has, by file name. */
export async function listPremium(owner: string): Promise<Record<string, PremiumInfo>> {
  const found = await safeDocs.list<PremiumDoc>("premium", owner, 500);

  return Object.fromEntries(found.map((doc) => [doc.id, { priceOctas: doc.data.priceOctas }]));
}

/** Every paid file on the site, as "owner|file" (so public feeds can leave them out). */
export async function allPremiumKeys(): Promise<Set<string>> {
  const found = await safeDocs.listKind<PremiumDoc>("premium", 1000);

  return new Set(found.map((doc) => `${doc.scope}|${doc.id}`));
}

export async function savePremium(owner: string, blobName: string, priceOctas: number, keyB64: string) {
  await docs.put("premium", owner, blobName, { priceOctas, sealedKey: sealKey(keyB64) } satisfies PremiumDoc);
}

export async function readPremiumKey(owner: string, blobName: string): Promise<{ priceOctas: number; key: string } | null> {
  const doc = await docs.get<PremiumDoc>("premium", owner, blobName);

  return doc ? { priceOctas: doc.data.priceOctas, key: openKey(doc.data.sealedKey) } : null;
}

interface Purchase {
  hash: string;
  amount: string;
}

const purchaseId = (buyer: string, blobName: string) => `${buyer}|${blobName}`;

export async function getPurchase(owner: string, buyer: string, blobName: string) {
  return (await docs.get<Purchase>("purchase", owner, purchaseId(buyer, blobName)))?.data ?? null;
}

export async function recordPurchase(owner: string, buyer: string, blobName: string, purchase: Purchase) {
  await docs.put("purchase", owner, purchaseId(buyer, blobName), purchase);
}

/** A transaction can unlock only one file, once. Returns false if it was already used for something else. */
export async function claimTransaction(hash: string, buyer: string, owner: string, blobName: string): Promise<boolean> {
  const id = hash.toLowerCase();

  const existing = await docs.get<{ buyer: string; blobName: string }>("purchase_tx", owner, id);

  if (existing) return existing.data.buyer === buyer && existing.data.blobName === blobName;

  await docs.put("purchase_tx", owner, id, { buyer, blobName });

  return true;
}

export async function salesFor(owner: string): Promise<{ count: number; total: bigint }> {
  const found = await safeDocs.list<Purchase>("purchase", owner, 1000);

  return {
    count: found.length,
    total: found.reduce((sum, doc) => sum + BigInt(doc.data.amount || "0"), BigInt(0)),
  };
}
