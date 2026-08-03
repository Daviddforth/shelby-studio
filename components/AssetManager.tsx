"use client";

import { useEffect, useState } from "react";

interface AssetManagerProps {
  image: {
    preview: string;
    file: File | null;
  };
}

export default function AssetManager({
  image,
}: AssetManagerProps) {

  const [dimensions, setDimensions] = useState("");

  const [hash, setHash] = useState("");



  useEffect(() => {

    if (!image.file) {
      setDimensions("");
      setHash("");
      return;
    }


    const img = new Image();

    img.onload = () => {
      setDimensions(
        `${img.width}px × ${img.height}px`
      );
    };

    img.src = image.preview;



    async function generateHash() {

      const buffer =
        await image.file!.arrayBuffer();


      const digest =
        await crypto.subtle.digest(
          "SHA-256",
          buffer
        );


      const hashArray =
        Array.from(
          new Uint8Array(digest)
        );


      const hashString =
        hashArray
          .map((b) =>
            b.toString(16).padStart(2, "0")
          )
          .join("");


      setHash(hashString.slice(0, 24) + "...");
    }


    generateHash();


  }, [image]);



  return (

    <div className="rounded-2xl border bg-white p-6 shadow-lg">


      <h2 className="text-xl font-bold text-blue-700">
        Asset Manager
      </h2>



      {!image.file ? (

        <div className="mt-6 rounded-lg bg-gray-100 p-6 text-center text-gray-500">

          Upload an NFT image to inspect asset details

        </div>


      ) : (


        <div className="mt-6 space-y-4">


          <div>
            <p className="text-sm text-gray-500">
              File Name
            </p>

            <p className="font-semibold">
              {image.file.name}
            </p>
          </div>



          <div>
            <p className="text-sm text-gray-500">
              File Size
            </p>

            <p className="font-semibold">
              {(image.file.size / 1024 / 1024).toFixed(2)}
              {" "}MB
            </p>
          </div>



          <div>
            <p className="text-sm text-gray-500">
              File Type
            </p>

            <p className="font-semibold">
              {image.file.type}
            </p>
          </div>



          <div>
            <p className="text-sm text-gray-500">
              Dimensions
            </p>

            <p className="font-semibold">
              {dimensions || "Calculating..."}
            </p>
          </div>



          <div>
            <p className="text-sm text-gray-500">
              SHA-256 Hash
            </p>

            <p className="font-mono text-sm break-all">
              {hash || "Generating..."}
            </p>
          </div>



          <div className="rounded-lg bg-green-50 p-4 text-green-700">
            ✅ Asset Ready For Shelby Upload
          </div>


        </div>

      )}


    </div>

  );
}