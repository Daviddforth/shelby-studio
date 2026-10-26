export const PREMIUM_MIN_OCTAS = 1_000_000; // 0.01 APT
export const PREMIUM_MAX_OCTAS = 100_000_000_000; // 1,000 APT
/** The whole file is encrypted and decrypted in the browser's memory, so the size is limited. */
export const PREMIUM_MAX_BYTES = 200 * 1024 * 1024;

export interface PremiumInfo {
  priceOctas: number;
}

export const premiumSetFields = (blobName: string, priceOctas: number, keyHash: string) => [
  blobName,
  String(priceOctas),
  keyHash,
];

export const premiumUnlockFields = (owner: string, blobName: string, txHash: string) => [
  owner.toLowerCase(),
  blobName,
  txHash.toLowerCase(),
];

export function validPrice(octas: unknown): octas is number {
  return (
    typeof octas === "number" && Number.isInteger(octas) && octas >= PREMIUM_MIN_OCTAS && octas <= PREMIUM_MAX_OCTAS
  );
}
