"use client";

import { ImagePlus } from "lucide-react";
import { useCollection } from "@/context/CollectionContext";

export default function CollectionBranding() {
  const { collection, setCollection } = useCollection();

  function upload(
    key: "logo" | "banner",
    file: File
  ) {
    const preview = URL.createObjectURL(file);

    setCollection((prev) => ({
      ...prev,
      [key]: preview,
    }));
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Collection Branding
      </h2>

      <p className="mt-2 text-slate-400">
        Upload your collection logo and banner.
      </p>

      <div className="mt-8 space-y-8">
        {/* Logo */}
        <div>
          <label className="mb-3 block text-sm text-slate-400">
            Collection Logo
          </label>

          <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 transition hover:border-blue-500">
            {collection.logo ? (
              <img
                src={collection.logo}
                alt="Collection Logo"
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <>
                <ImagePlus
                  size={42}
                  className="text-blue-500"
                />
                <span className="mt-4 text-slate-400">
                  Upload Logo
                </span>
              </>
            )}

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) upload("logo", file);
              }}
            />
          </label>
        </div>

        {/* Banner */}
        <div>
          <label className="mb-3 block text-sm text-slate-400">
            Collection Banner
          </label>

          <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 transition hover:border-blue-500">
            {collection.banner ? (
              <img
                src={collection.banner}
                alt="Collection Banner"
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <>
                <ImagePlus
                  size={42}
                  className="text-blue-500"
                />
                <span className="mt-4 text-slate-400">
                  Upload Banner
                </span>
              </>
            )}

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) upload("banner", file);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}