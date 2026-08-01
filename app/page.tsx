"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import NFTForm from "../components/NFTForm";
import NFTPreview from "../components/NFTPreview";
import MetadataOutput from "../components/MetadataOutput";

import { Attribute } from "../components/types";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [traitType, setTraitType] = useState("");
  const [traitValue, setTraitValue] = useState("");

  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const [metadata, setMetadata] = useState("");

  function generateMetadata() {
    const nft = {
      name,
      description,
      image,
      attributes,
    };

    setMetadata(JSON.stringify(nft, null, 2));
  }

  return (
    <main className="min-h-screen bg-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 p-8">
        <NFTForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          image={image}
          setImage={setImage}
          traitType={traitType}
          setTraitType={setTraitType}
          traitValue={traitValue}
          setTraitValue={setTraitValue}
          attributes={attributes}
          setAttributes={setAttributes}
          generateMetadata={generateMetadata}
        />

        <div className="space-y-8">
          <NFTPreview
            image={image}
            name={name}
            description={description}
          />

          <MetadataOutput metadata={metadata} />
        </div>
      </div>
    </main>
  );
}