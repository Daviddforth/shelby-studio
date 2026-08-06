"use client";

import { useRef } from "react";
import {
  ImagePlus,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

import { useCollection } from "@/context/CollectionContext";

export default function CollectionBranding() {
  const { collection, setCollection } = useCollection();

  const logoInputRef =
    useRef<HTMLInputElement>(null);

  const bannerInputRef =
    useRef<HTMLInputElement>(null);

  function upload(
    key: "logo" | "banner",
    file: File
  ) {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    /*
     * Collection branding is currently
     * persisted in localStorage.
     *
     * Store a data URL rather than a blob:
     * URL because blob URLs die after refresh.
     */
    const maxSize =
      key === "logo"
        ? 1.5 * 1024 * 1024
        : 2.5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        key === "logo"
          ? "Logo must be smaller than 1.5 MB."
          : "Banner must be smaller than 2.5 MB."
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setCollection((previous) => ({
        ...previous,
        [key]: reader.result as string,
      }));
    };

    reader.onerror = () => {
      alert("Unable to read this image.");
    };

    reader.readAsDataURL(file);
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 px-7 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <ImagePlus size={19} />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Collection Branding
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define how your collection appears across Shelby Studio.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-7 p-7">
        {/* LOGO */}
        <div>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-200">
                Collection logo
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Recommended 1:1 square image
              </p>
            </div>

            {collection.logo && (
              <button
                type="button"
                onClick={() =>
                  logoInputRef.current?.click()
                }
                className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
              >
                Replace
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              logoInputRef.current?.click()
            }
            className="group flex w-full items-center gap-5 rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-left transition hover:border-blue-500/60 hover:bg-blue-500/[0.03]"
          >
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-lg">
              {collection.logo ? (
                <img
                  src={collection.logo}
                  alt="Collection logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon
                  size={28}
                  className="text-slate-600"
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 font-medium text-slate-200 transition group-hover:text-white">
                <Upload
                  size={16}
                  className="text-blue-400"
                />

                {collection.logo
                  ? "Change collection logo"
                  : "Upload collection logo"}
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                PNG, JPG or WebP. A square image works best.
              </p>
            </div>
          </button>

          <input
            ref={logoInputRef}
            hidden
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file =
                event.target.files?.[0];

              if (file) {
                upload("logo", file);
              }

              event.target.value = "";
            }}
          />
        </div>

        {/* BANNER */}
        <div>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-200">
                Collection cover
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Recommended wide landscape image
              </p>
            </div>

            {collection.banner && (
              <button
                type="button"
                onClick={() =>
                  bannerInputRef.current?.click()
                }
                className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
              >
                Replace
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              bannerInputRef.current?.click()
            }
            className="group relative flex aspect-[3.4/1] w-full overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950 transition hover:border-blue-500/60"
          >
            {collection.banner ? (
              <>
                <img
                  src={collection.banner}
                  alt="Collection banner"
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
                />

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                    <Upload size={16} />
                    Replace cover
                  </span>
                </div>
              </>
            ) : (
              <div className="m-auto text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  <Upload size={19} />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-300">
                  Upload collection cover
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  PNG, JPG or WebP
                </p>
              </div>
            )}
          </button>

          <input
            ref={bannerInputRef}
            hidden
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file =
                event.target.files?.[0];

              if (file) {
                upload("banner", file);
              }

              event.target.value = "";
            }}
          />
        </div>
      </div>
    </section>
  );
}
