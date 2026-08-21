"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileUp } from "lucide-react";

interface Props {
  onSelect?: (file: File) => void;
  disabled?: boolean;
}

export default function AssetUploader({
  onSelect,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file?: File) {
    if (!file || disabled) return;
    onSelect?.(file);
  }

  function openPicker() {
    if (!disabled) {
      inputRef.current?.click();
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={openPicker}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openPicker();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFile(event.dataTransfer.files?.[0]);
      }}
      className={[
        "min-w-0 rounded-3xl border-2 border-dashed p-6 text-center",
        "transition sm:p-10",
        disabled
          ? "cursor-not-allowed border-slate-800 opacity-60"
          : dragging
            ? "cursor-copy border-blue-400 bg-blue-500/5"
            : "cursor-pointer border-slate-700 bg-slate-950 hover:border-blue-500 hover:bg-slate-900",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
        {dragging ? (
          <FileUp
            size={30}
            className="text-blue-400"
          />
        ) : (
          <UploadCloud
            size={30}
            className="text-blue-500"
          />
        )}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white sm:text-xl">
        {disabled
          ? "Upload in progress..."
          : dragging
            ? "Drop your file here"
            : "Upload to Shelby"}
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        {disabled
          ? "Please wait while Shelby stores your asset."
          : "Drag and drop a file here, or tap to choose one from your device."}
      </p>

      {!disabled && (
        <p className="mt-4 text-xs text-slate-600">
          Works on desktop and mobile
        </p>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        disabled={disabled}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);

          // Allow selecting the same file again.
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}
