"use client";

import { useState } from "react";

import Navbar from "../../components/Navbar";
import Dashboard from "../../components/Dashboard";
import SettingsPanel from "../../components/SettingsPanel";
import NFTForm from "../../components/NFTForm";
import NFTPreview from "../../components/NFTPreview";
import MetadataOutput from "../../components/MetadataOutput";
import CollectionGenerator from "../../components/CollectionGenerator";
import Footer from "../../components/Footer";

import { Attribute } from "../../components/types";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [traitType, setTraitType] = useState("");
  const [traitValue, setTraitValue] = useState("");

  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const [metadata, setMetadata] = useState("");

  const [collectionSize, setCollectionSize] = useState(10);

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

      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-8 py-14">
          <h1 className="text-5xl font-bold">
            Shelby NFT Metadata Manager
          </h1>

          <p className="mt-4 text-blue-100 text-lg max-w-2xl">
            Create, preview, validate and export NFT metadata through a modern
            dashboard designed for creators and developers.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 pt-8">
        <Dashboard
          nfts={metadata ? 1 : 0}
          attributes={attributes.length}
          collection={collectionSize}
        />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 p-8">
        <div className="lg:col-span-2">
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
        </div>

        <div className="space-y-6">
          <CollectionGenerator
            amount={collectionSize}
            setAmount={setCollectionSize}
          />

          <SettingsPanel
            collectionSize={collectionSize}
            setCollectionSize={setCollectionSize}
          />

          <NFTPreview
            image={image}
            name={name}
            description={description}
          />

          <MetadataOutput
            metadata={metadata}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}