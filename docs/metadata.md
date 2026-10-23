# Metadata

The Metadata page (`/metadata`) is a builder for NFT metadata. You enter the fields, add attributes and an image, check that the required fields are filled, preview the JSON, and then download it, copy it or store it on Shelby.

Metadata belongs to the connected wallet. When no wallet is connected, the page shows a demo workspace instead.

## Overview

The Metadata workspace includes:

- Templates
- NFT information
- Image upload
- Attribute builder
- Import of an existing `metadata.json`
- NFT preview
- JSON preview
- Validation checklist
- Actions (Store on Shelby, Download JSON, Copy JSON, Reset Metadata)

## Architecture

```
app/metadata/page.tsx
context/MetadataContext.tsx
components/metadata/
├── AttributeBuilder.tsx
├── ImageUploader.tsx
├── ImportMetadata.tsx
├── JsonPreview.tsx
├── MetadataActions.tsx
├── MetadataHeader.tsx
├── MetadataTemplates.tsx
├── MetadataValidation.tsx
├── NFTInformation.tsx
└── NFTPreview.tsx
```

All state lives in `MetadataContext`. The components read and write that one metadata object.

## Metadata Data

| Field | Notes |
| --- | --- |
| `name` | NFT name (required) |
| `description` | Free text (required) |
| `collection` | Collection name |
| `image` | Image reference (required, or an image preview) |
| `animation_url` | Optional |
| `external_url` | Optional |
| `attributes` | List of `trait_type` / `value` pairs |
| `storage` | Record of the last `metadata.json` stored on Shelby, if any |

## Draft Storage

The draft saves automatically to the browser's `localStorage`, under a key based on the connected wallet address (`shelby-metadata:<address>`). It stays on that device and browser, and each wallet address has its own draft. Reset Metadata clears it.

## Workflow

```
Open Metadata → (optional) Apply a template → Enter NFT information
      → Add image → Add attributes → Check validation → Preview JSON
      → Download / Copy / Store on Shelby
```

You can also start by importing an existing `metadata.json` file.

### Templates

Three predefined templates are available: **PFP Collection**, **Game Item** and **Music NFT**. Applying a template sets the collection name and replaces the attribute list with a starter set of trait names. It does not change the name, description or image.

### NFT Information

Fields for NFT name, collection, animation URL, external URL, description and image.

### Image Upload

The image uploader lets you select an image, preview it, and upload it to Shelby through the standard storage upload. After upload, the metadata `image` value is set to the stored blob name (or file name). Until then it stays empty.

### Attribute Builder

Attributes can be added, edited and removed. Each follows the common NFT trait pattern:

```json
{
  "trait_type": "Background",
  "value": "Blue"
}
```

When the JSON is generated, attributes with an empty trait type or value are left out.

### Import

Import reads a `.json` file and loads `name`, `description`, `collection`, `image`, `animation_url`, `external_url` and `attributes` into the builder. Missing fields become empty. An invalid file shows an error.

### Validation

The validation panel checks as you type:

- Required: NFT name, description, image
- Optional: collection, attributes

Store on Shelby is blocked until the required fields are filled. Validation is only a completeness check. It does not confirm that the image is stored or that the metadata is correct for a particular marketplace.

### JSON Preview

Shows the metadata JSON that will be exported:

```json
{
  "name": "Example NFT",
  "description": "Example NFT description",
  "image": "image-uri",
  "collection": "",
  "animation_url": "",
  "external_url": "",
  "attributes": [
    { "trait_type": "Background", "value": "Blue" }
  ]
}
```

The actual output depends on what you entered.

### Actions

| Action | What it does |
| --- | --- |
| **Store on Shelby** | Uploads the JSON as `metadata.json` through the storage upload route and shows the stored file name, blob name, network and owner. |
| **Download JSON** | Downloads the JSON, named after the NFT. |
| **Copy JSON** | Copies the JSON to the clipboard. |
| **Reset Metadata** | Clears the draft and removes it from `localStorage`. |

## Relationship to Other Pages

- **Collections** (`/collections`) has its own draft. The two drafts are not linked on the current pages.
- **Assets** (`/assets`) lists the files stored with your wallet, including stored `metadata.json` files.
- Files are uploaded on the **Upload** page. Videos, audio and images then appear in the **Library**.

## Limitations

The Metadata page prepares and stores metadata JSON. It does not provide:

- NFT minting
- Marketplace listing
- Blockchain ownership management
- Batch metadata generation for a whole collection
- Version history
- Multi-user collaboration

## Summary

Metadata is a wallet-scoped builder for a single NFT's metadata. The draft is saved in the browser, and the finished JSON can be downloaded, copied or uploaded to Shelby.
