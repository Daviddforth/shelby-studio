"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  UserCircle2,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

export default function AvatarUploader() {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [
    avatar,
    setAvatar,
  ] = useState<string | null>(null);

  /*
   * Every wallet gets its own avatar.
   */
  function getAvatarKey(
    address: string
  ) {
    return `shelby-profile-avatar-${address.toLowerCase()}`;
  }

  /*
   * Load the avatar belonging only
   * to the connected wallet.
   */
  useEffect(() => {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      setAvatar(null);
      return;
    }

    try {
      const savedAvatar =
        localStorage.getItem(
          getAvatarKey(walletAddress)
        );

      setAvatar(savedAvatar);
    } catch (error) {
      console.error(
        "Failed to load profile avatar:",
        error
      );

      setAvatar(null);
    }
  }, [
    walletConnected,
    walletAddress,
  ]);

  function handleSelect(
    file: File
  ) {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      return;
    }

    /*
     * Only accept images.
     */
    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "Please choose a valid image file."
      );

      return;
    }

    /*
     * Keep localStorage usage reasonable.
     *
     * This is temporary persistence until
     * the real Shelby Storage integration
     * handles profile media.
     */
    const MAX_SIZE =
      2 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert(
        "Profile image must be smaller than 2 MB."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const result =
        reader.result;

      if (
        typeof result !== "string"
      ) {
        return;
      }

      try {
        localStorage.setItem(
          getAvatarKey(walletAddress),
          result
        );

        setAvatar(result);
      } catch (error) {
        console.error(
          "Failed to save profile avatar:",
          error
        );

        alert(
          "The profile image could not be saved."
        );
      }
    };

    reader.onerror = () => {
      console.error(
        "Failed to read profile image."
      );
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {avatar ? (
          <img
            src={avatar}
            alt="Profile avatar"
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

        {walletConnected &&
          walletAddress && (
            <>
              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-3 transition hover:bg-blue-500"
                aria-label="Change profile picture"
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
                onChange={(event) => {
                  const file =
                    event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  handleSelect(file);

                  /*
                   * Allow selecting the same
                   * image again later.
                   */
                  event.target.value = "";
                }}
              />
            </>
          )}
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {walletConnected
          ? avatar
            ? "Change Profile Picture"
            : "Upload Profile Picture"
          : "Connect wallet to add profile picture"}
      </p>
    </div>
  );
}
