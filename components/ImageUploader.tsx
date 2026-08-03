"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onImageUpload: (data: {
    preview: string;
    file: File;
  }) => void;
}

export default function ImageUploader({
  onImageUpload,
}: Props) {

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {

      const file = acceptedFiles[0];

      if (!file) return;

      const preview = URL.createObjectURL(file);

      onImageUpload({
        preview,
        file,
      });

    },
    [onImageUpload]
  );


  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });


  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-blue-500 rounded-xl p-8 cursor-pointer bg-blue-50 text-center hover:bg-blue-100 transition"
    >

      <input {...getInputProps()} />

      <p className="text-blue-700 font-semibold">
        📷 Click or Drag an NFT Image Here
      </p>

      <p className="text-gray-500 text-sm mt-2">
        PNG, JPG, WEBP supported
      </p>

    </div>
  );
}