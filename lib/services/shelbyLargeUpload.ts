/*
 * Shelby Studio upload mode helpers.
 *
 * File bytes are uploaded directly from
 * the browser to Shelby Storage.
 *
 * The mode is retained mainly for UI
 * purposes so Shelby Studio can identify
 * larger uploads.
 */

export const LARGE_FILE_THRESHOLD =
  100 * 1024 * 1024;

export type UploadMode =
  | "standard"
  | "streaming";

export interface LargeUploadProgress {
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

export function getUploadMode(
  file: File
): UploadMode {
  return file.size >=
    LARGE_FILE_THRESHOLD
    ? "streaming"
    : "standard";
}

export function calculateUploadPercentage(
  uploadedBytes: number,
  totalBytes: number
) {
  if (totalBytes <= 0) {
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