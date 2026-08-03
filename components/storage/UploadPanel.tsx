"use client";

import { useRef, useState } from "react";
import { CloudUpload, Plus, FileText } from "lucide-react";

export default function UploadPanel() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleChooseFile() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Shelby Storage
          </h2>

          <p className="mt-2 text-slate-400">
            Upload files that will be linked to your connected wallet and
            permanently stored on Shelby Storage.
          </p>

        </div>

        <CloudUpload
          className="text-blue-500"
          size={34}
        />

      </div>

      <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-10 text-center transition hover:border-blue-500">

        <Plus
          size={48}
          className="mx-auto text-blue-500"
        />

        <h3 className="mt-5 text-xl font-semibold text-white">
          Upload to Shelby Storage
        </h3>

        <p className="mt-3 text-slate-400">
          Images, videos, metadata, documents and wallet assets.
        </p>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={handleChooseFile}
          className="mt-8 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Choose File
        </button>

        {selectedFile && (
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-5 text-left">

            <div className="flex items-center gap-4">

              <FileText
                size={28}
                className="text-blue-400"
              />

              <div>

                <p className="font-semibold text-white">
                  {selectedFile.name}
                </p>

                <p className="text-sm text-slate-400">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>

              </div>

            </div>

            <button
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Upload to Shelby
            </button>

          </div>
        )}

      </div>

    </div>
  );
}