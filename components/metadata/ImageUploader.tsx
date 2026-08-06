"use client";

import {
  useCallback,
  useState,
} from "react";

import { useDropzone } from "react-dropzone";

import {
  UploadCloud,
  ImageIcon,
  Trash2,
  CloudUpload,
  CheckCircle2,
} from "lucide-react";

import { useStorage } from "@/hooks/useStorage";
import { useMetadata } from "@/context/MetadataContext";

export default function ImageUploader() {
  const {
    upload,
    loading,
  } = useStorage();

  const {
    metadata,
    setMetadata,
  } = useMetadata();

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(null);

  const [
    uploadError,
    setUploadError,
  ] = useState("");

  /*
   * Selecting artwork is local only.
   *
   * We use a data URL instead of
   * URL.createObjectURL().
   *
   * Blob URLs die after a refresh.
   * Data URLs remain valid when the
   * metadata is restored from localStorage.
   */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        return;
      }

      setUploadError("");

      if (
        !file.type.startsWith("image/")
      ) {
        setUploadError(
          "Please select a valid image."
        );

        return;
      }

      /*
       * Prevent extremely large images
       * from being written into localStorage.
       *
       * The original file is still uploaded
       * directly to Shelby when requested.
       */
      const MAX_PREVIEW_SIZE =
        2 * 1024 * 1024;

      if (
        file.size >
        MAX_PREVIEW_SIZE
      ) {
        setUploadError(
          "Artwork preview must be smaller than 2 MB."
        );

        return;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result !==
          "string"
        ) {
          setUploadError(
            "Could not create artwork preview."
          );

          return;
        }

        setSelectedFile(file);

        setMetadata((prev) => ({
          ...prev,

          /*
           * The real Shelby reference
           * remains empty until upload.
           */
          image: "",

          /*
           * Persistent browser preview.
           */
          imagePreview:
            reader.result as string,
        }));
      };

      reader.onerror = () => {
        setUploadError(
          "Could not read the selected image."
        );
      };

      reader.readAsDataURL(file);
    },
    [setMetadata]
  );

  /*
   * Upload the original File object
   * directly to Shelby.
   */
  async function uploadToShelby(
    event: React.MouseEvent
  ) {
    event.stopPropagation();

    if (
      !selectedFile ||
      loading
    ) {
      return;
    }

    setUploadError("");

    try {
      const asset =
        await upload(selectedFile);

      setMetadata((prev) => ({
        ...prev,

        /*
         * Actual Shelby asset reference.
         */
        image:
          asset.blobName ||
          asset.name,

        /*
         * Keep the persistent local
         * preview for Shelby Studio UI.
         */
        imagePreview:
          prev.imagePreview,
      }));

      setSelectedFile(null);
    } catch (error) {
      console.error(
        "Metadata artwork upload failed:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Could not upload artwork to Shelby."
      );
    }
  }

  function removeImage(
    event?: React.MouseEvent
  ) {
    event?.stopPropagation();

    setSelectedFile(null);
    setUploadError("");

    setMetadata((prev) => ({
      ...prev,
      image: "",
      imagePreview: "",
    }));
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,

    accept: {
      "image/*": [],
    },

    noClick: !!metadata.imagePreview,
  });

  const hasPreview =
    !!metadata.imagePreview;

  const uploaded =
    !!metadata.image &&
    !selectedFile;

  return (
    <div
      {...getRootProps()}
      className={`rounded-2xl border-2 border-dashed p-8 transition ${
        isDragActive
          ? "border-blue-500 bg-slate-900"
          : "border-slate-700 bg-slate-950"
      } ${
        !hasPreview
          ? "cursor-pointer"
          : ""
      }`}
    >
      <input {...getInputProps()} />

      {!hasPreview ? (
        <div className="text-center">
          <UploadCloud
            size={60}
            className="mx-auto text-blue-500"
          />

          <h3 className="mt-5 text-xl font-semibold text-white">
            Drag & Drop NFT Artwork
          </h3>

          <p className="mt-2 text-slate-400">
            or click to browse
          </p>

          <p className="mt-4 text-xs text-slate-500">
            Selecting artwork does not
            start a Shelby transaction.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <img
              src={metadata.imagePreview}
              alt={
                metadata.name ||
                "NFT artwork preview"
              }
              className="max-h-80 w-full object-contain"
            />
          </div>

          {uploaded ? (
            <>
              <CheckCircle2
                size={42}
                className="mx-auto mt-5 text-green-500"
              />

              <h3 className="mt-3 font-semibold text-white">
                Artwork Stored on Shelby
              </h3>

              <p className="mt-2 break-all text-sm text-green-400">
                {metadata.image}
              </p>
            </>
          ) : (
            <>
              <ImageIcon
                size={38}
                className="mx-auto mt-5 text-blue-400"
              />

              <h3 className="mt-3 font-semibold text-white">
                {selectedFile?.name ||
                  "Artwork selected"}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Ready to upload to Shelby
              </p>
            </>
          )}

          {uploadError && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {uploadError}
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {!uploaded &&
              selectedFile && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={
                    uploadToShelby
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CloudUpload
                    size={18}
                  />

                  {loading
                    ? "Uploading..."
                    : "Upload to Shelby"}
                </button>
              )}

            <button
              type="button"
              disabled={loading}
              onClick={removeImage}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={18} />

              Remove
            </button>
          </div>

          {!uploaded &&
            selectedFile && (
              <p className="mt-4 text-xs text-slate-500">
                Your wallet will request
                approval when you upload
                the artwork to Shelby.
              </p>
            )}
        </div>
      )}
    </div>
  );
}
