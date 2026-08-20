# Assets

## Overview

The Assets workspace is the central place for viewing and working with files stored through Shelby Studio.

It provides a focused interface for discovering stored assets, inspecting asset information, and moving between the asset explorer and the rest of the Shelby Studio workflow.

## Asset Workflow

The typical asset workflow is:

1. Upload an asset through Shelby Studio.
2. Store the asset through the Shelby storage pipeline.
3. Discover stored assets through the Assets or Explorer workspace.
4. Inspect asset metadata and storage information.
5. Download or otherwise use the asset when required.

## Asset API

Shelby Studio exposes API routes that support asset discovery and inspection.

### List Assets

```text
GET /api/shelby/assets
```

Returns assets associated with the configured Shelby account.

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

Downloads an asset from Shelby storage.

## Relationship With Explorer

The Assets workspace focuses on the stored asset experience, while Explorer provides tools for searching, filtering, sorting, and exploring available assets.

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

Assets are a core part of Shelby Studio. They connect the upload pipeline, Shelby storage, Explorer, metadata, and developer APIs into one workflow.
