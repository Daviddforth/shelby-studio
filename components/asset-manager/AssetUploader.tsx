"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface Props {
  onSelect?: (file: File) => void;
}

export default function AssetUploader({
  onSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file?: File) {
    if (!file) return;
    onSelect?.(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
      }}
      className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-700 bg-slate-950 p-10 text-center transition hover:border-blue-500"
    >
      <UploadCloud
        size={54}
        className="mx-auto text-blue-500"
      />

      <h3 className="mt-5 text-xl font-semibold text-white">
        Drag & Drop Files
      </h3>

      <p className="mt-3 text-slate-400">
        or click to browse your computer
      </p>

      <input
        ref={inputRef}
        hidden
        type="file"
        onChange={(e) =>
          handleFile(e.target.files?.[0])
        }
      />
    </div>
  );
}