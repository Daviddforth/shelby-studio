"use client";

import { useRef, useState } from "react";
import { Camera, UserCircle2 } from "lucide-react";

export default function AvatarUploader() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<string | null>(null);

  function handleSelect(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">

        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-40 w-40 rounded-full border-4 border-blue-600 object-cover"
          />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-slate-700 bg-slate-900">
            <UserCircle2
              size={120}
              className="text-slate-500"
            />
          </div>
        )}

        <button
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-3 transition hover:bg-blue-700"
        >
          <Camera
            size={18}
            className="text-white"
          />
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            handleSelect(file);
          }}
        />

      </div>

      <p className="mt-4 text-sm text-slate-400">
        Upload Profile Picture
      </p>
    </div>
  );
}