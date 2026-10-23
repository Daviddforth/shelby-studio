# Collections

The Collections page (`/collections`) is a builder for describing an NFT collection. You fill in the collection details, add a logo and banner, review a preview, and then export the result as JSON or upload it to Shelby.

Collections belong to the connected wallet. They are not grouped under any other workspace object.

## Overview

The collection builder provides:

- Collection information
- Collection branding (logo and banner)
- Collection preview
- Collection actions (Export JSON, Publish to Shelby, Reset)

When no wallet is connected, the page shows a demo collection with sample data. Connect a wallet to build your own.

## Architecture

```
app/collections/page.tsx
context/CollectionContext.tsx
components/collections/
├── CollectionActions.tsx
├── CollectionAssets.tsx
├── CollectionBranding.tsx
├── CollectionHeader.tsx
├── CollectionInformation.tsx
└── CollectionPreview.tsx
```

The page renders the header, information, branding, actions and preview components. `CollectionAssets.tsx` exists in the components folder but is not rendered on the current page.

## Collection Data

The collection is a single draft object held in `CollectionContext`:

| Field | Notes |
| --- | --- |
| `name` | Collection name |
| `symbol` | Short symbol |
| `description` | Free text |
| `creator` | Creator name |
| `category` | Free text |
| `royalty` | Percentage, clamped to 0-100, default 5 |
| `visibility` | `Private` (default) or `Public` |
| `banner`, `logo` | Image references |
| `metadataAttached` | Flag in the context; no component on the current page sets it |

## Draft Storage

The draft saves automatically to the browser's `localStorage`, under a key based on the connected wallet address (`shelby-collection:<address>`). This means:

- The draft stays on the device and browser where it was created.
- Each wallet address has its own draft.
- Disconnecting the wallet clears the draft from view; reconnecting loads it again.
- There is no Save Draft button, because saving happens on every change.

## Collection Branding

Branding provides logo and banner uploads for the collection, separate from the text fields in Collection Information.

## Collection Preview

The preview shows how the collection information and branding look together. It is a visual preview only. It can also display an image from the connected wallet's stored Shelby files.

## Collection Actions

| Action | What it does |
| --- | --- |
| **Export JSON** | Downloads the current draft as `collection.json`. |
| **Publish to Shelby** | Uploads the draft as a JSON file named `collection-<timestamp>.json` through the standard storage upload. The success message shows the stored file name. |
| **Reset** | Clears the draft and removes it from `localStorage`. |

"Publish to Shelby" stores a JSON file. It does not mint an NFT, deploy a contract or list the collection anywhere.

## Relationship to Other Pages

- **Metadata** (`/metadata`) builds metadata for a single NFT. It keeps its own draft and is separate from the collection draft.
- **Assets** (`/assets`) lists the files stored with your wallet, including the collection JSON files you publish.
- **Library** (`/library`) hosts video, audio and images with public pages and embeds.

## Current Limitations

The collection builder does not provide:

- NFT minting
- Marketplace deployment or listing
- Collection-wide blockchain indexing
- Multi-user collaboration
- Version history for drafts
- Drafts that sync across devices

## Summary

Collections is a wallet-scoped builder: one draft, saved automatically in the browser, that you can export as JSON or upload to Shelby as a file.
