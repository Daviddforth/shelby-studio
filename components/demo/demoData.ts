export const demoCollection = {
  name: "Shelby Genesis",
  symbol: "SGEN",
  description:
    "A showcase collection created with Shelby Studio.",
  creator: "Demo Creator",
  banner: "",
  logo: "",
  royalty: 5,
  category: "Digital Art",
  visibility: "Public" as const,
  metadataAttached: true,
};

export const demoMetadata = {
  name: "Shelby Genesis #001",
  description:
    "A sample NFT metadata record prepared with Shelby Studio.",
  collection: "Shelby Genesis",
  image: "shelby-genesis-001.png",
  animation_url: "",
  external_url: "",
  attributes: [
    {
      trait_type: "Background",
      value: "Midnight",
    },
    {
      trait_type: "Eyes",
      value: "Electric Blue",
    },
    {
      trait_type: "Accessory",
      value: "Digital Halo",
    },
  ],
};

export const demoAssets = [
  {
    name: "shelby-genesis-001.png",
    type: "image/png",
    size: 2.4 * 1024 * 1024,
    status: "Stored",
  },
  {
    name: "shelby-genesis-002.png",
    type: "image/png",
    size: 3.1 * 1024 * 1024,
    status: "Stored",
  },
  {
    name: "shelby-genesis-metadata.json",
    type: "application/json",
    size: 18 * 1024,
    status: "Stored",
  },
];
