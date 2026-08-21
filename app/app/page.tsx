"use client";

import { useState } from "react";

import Navbar from "../../components/Navbar";
import Dashboard from "../../components/Dashboard";
import AssetManager from "../../components/AssetManager";
import ShelbyStatus from "../../components/ShelbyStatus";
import NetworkSwitcher from "../../components/NetworkSwitcher";
import SettingsPanel from "../../components/SettingsPanel";
import NFTReadinessScore from "../../components/NFTReadinessScore";
import NFTForm from "../../components/NFTForm";
import NFTPreview from "../../components/NFTPreview";
import MetadataOutput from "../../components/MetadataOutput";
import CollectionGenerator from "../../components/CollectionGenerator";
import Footer from "../../components/Footer";
import WalletNFTGallery from "../../components/nft/WalletNFTGallery";

import { Attribute } from "../../components/types";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState<{
    preview: string;
    file: File | null;
  }>({
    preview: "",
    file: null,
  });

  const [traitType, setTraitType] = useState("");
  const [traitValue, setTraitValue] = useState("");

  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const [metadata, setMetadata] = useState("");

  const [collectionSize, setCollectionSize] = useState(10);

  function generateMetadata() {
    const nft = {
      name,
      description,
      image: image.preview,
      attributes,
    };

    setMetadata(JSON.stringify(nft, null, 2));
  }

  return (
    <main className="min-h-screen bg-blue-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <h1 className="text-5xl font-bold">
            Shelby Studio
          </h1>

          <p className="mt-4 text-lg text-blue-100 max-w-2xl">
            The all-in-one workspace for managing Shelby assets,
            NFTs, storage, and metadata.
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        <Dashboard />
      </div>

      {/* Wallet Status */}
      <div className="max-w-7xl mx-auto px-8 pb-10">
        <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-3">
          <NetworkSwitcher />

          <ShelbyStatus />

          <NFTReadinessScore
            name={name}
            description={description}
            image={image.preview}
            attributes={attributes}
          />
        </div>
      </div>

      {/* Connected Wallet NFTs */}
      <div className="max-w-7xl mx-auto px-8 pb-10">
        <WalletNFTGallery />
      </div>

      {/* NFT Creator */}
      <div className="mx-auto grid min-w-0 max-w-7xl gap-6 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-3 lg:gap-8">

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
            image={image.preview}
            name={name}
            description={description}
          />

          <MetadataOutput
            metadata={metadata}
          />

          <AssetManager
            image={image}
          />

        </div>

      </div>

      <Footer />
    </main>
  );
}