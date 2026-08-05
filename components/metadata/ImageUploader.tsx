"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  ImageIcon,
  Trash2,
} from "lucide-react";

import { useStorage } from "@/hooks/useStorage";
import { useMetadata } from "@/context/MetadataContext";

export default function ImageUploader() {
  const { upload, loading } = useStorage();

  const { metadata, setMetadata } = useMetadata();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      const asset = await upload(file);

      setMetadata((prev) => ({
        ...prev,
        image: asset.name,
      }));
    },
    [upload, setMetadata]
  );

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
  });

  function removeImage() {
    setMetadata((prev) => ({
      ...prev,
      image: "",
    }));
  }

  return (
    <div
      {...getRootProps()}
      className={`rounded-2xl border-2 border-dashed p-8 transition cursor-pointer ${
        isDragActive
          ? "border-blue-500 bg-slate-900"
          : "border-slate-700 bg-slate-950"
      }`}
    >
      <input {...getInputProps()} />

      {!metadata.image ? (
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

          {loading && (
            <p className="mt-5 text-blue-400">
              Uploading...
            </p>
          )}
        </div>
      ) : (
        <div className="text-center">
          <ImageIcon
            size={60}
            className="mx-auto text-green-500"
          />

          <h3 className="mt-5 text-white font-semibold">
            {metadata.image}
          </h3>

          <p className="mt-2 text-green-400">
            Ready for Metadata
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeImage();
            }}
            className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            <Trash2
              size={18}
              className="inline mr-2"
            />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}