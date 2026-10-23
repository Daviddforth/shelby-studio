# Assets

## Overview

The Assets workspace is the central place for viewing and working with files stored through Shelby Studio.

It lists every file stored on Shelby with the connected wallet, and lets you view, download, replace and delete them. Connect a wallet to see your files.

## Page Layout

At the top, stat cards show figures counted from the wallet's real files:

- Total files
- Storage used
- Videos
- Audio
- Images

Below the cards are two tabs:

- **Files** - the list of stored files, with Download, Replace and Delete actions.
- **History** - upload, replace and delete activity, kept in this browser's `localStorage` (up to 100 entries per wallet).

Videos, audio and images also get a public page and embed code in the **Library** (`/library`). New files are added from the **Upload** page.

## Asset Workflow

The typical asset workflow is:

1. Upload an asset through Shelby Studio.
2. Store the asset through the Shelby storage pipeline.
3. See stored assets in the Assets workspace (or, for any account, the Explorer).
4. Inspect asset metadata and storage information.
5. Download or otherwise use the asset when required.

## Asset API

Shelby Studio exposes API routes that support asset discovery and inspection.

### List Assets

```text
GET /api/shelby/assets
```

Returns assets for the account given in the `walletAddress` query parameter.

### Get Asset Metadata

```text
GET /api/shelby/asset
```

Retrieves information about an individual asset.

### Get Object Metadata

```text
GET /api/shelby/object
```

Retrieves full object metadata for a requested Shelby object.

### Download Asset

```text
GET /api/shelby/download
```

Downloads an asset from Shelby storage. Takes `owner` and `blobName` query parameters.

### Delete and Locations

`app/api/shelby/locations/route.ts` also exists under the same folder and is not described further here. `app/api/shelby/delete/route.ts` is disabled and returns `410 Gone`: deleting is signed by the owner's wallet in the browser.

## Relationship With Explorer

The Assets workspace shows and manages the connected wallet's own files. The Explorer is a public, read-only lookup that works for any account address and offers search, status filtering and sorting.

These surfaces work together rather than replacing one another.

## Relationship With Storage

Assets are created and persisted through the Shelby storage workflow.

The storage pipeline includes:

- Upload preparation
- Streaming upload
- Upload finalization
- Asset discovery
- Asset download

See the Storage Engine and Upload Pipeline documentation for the underlying implementation details.

## Implementation

The Assets experience is part of the Shelby Studio workspace and is backed by the Shelby API routes under:

```text
app/api/shelby/
```

Relevant routes include:

```text
app/api/shelby/assets/route.ts
app/api/shelby/asset/route.ts
app/api/shelby/object/route.ts
app/api/shelby/download/route.ts
```

## Summary

Assets are a core part of Shelby Studio. They connect the upload pipeline, Shelby storage, the Library, the Explorer, and the Shelby API routes.
