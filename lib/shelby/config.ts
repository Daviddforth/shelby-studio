/**
 * Shelbynet blob retention.
 *
 * Centralized retention configuration for Shelby Studio
 * so every upload path uses the same expiration policy.
 */

export const SHELBY_BLOB_RETENTION_HOURS = 48;

export const SHELBY_BLOB_RETENTION_MICROS =
  SHELBY_BLOB_RETENTION_HOURS *
  60 *
  60 *
  1_000_000;

export function getShelbyBlobExpirationMicros(
  now = Date.now()
): number {
  return (
    now * 1000 +
    SHELBY_BLOB_RETENTION_MICROS
  );
}
