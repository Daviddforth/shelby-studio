# Upload Pipeline

The Shelby Studio upload pipeline moves data from the application interface through the server-side storage layer and into Shelby storage.

## Overview

The upload architecture is divided into several stages:

```text
Browser
   |
   v
Upload Interface
   |
   v
Prepare Upload
   |
   v
Stream Upload
   |
   v
Finalize Upload
   |
   v
Shelby Storage
```

`/api/storage/upload` and `/api/storage/stream-upload` still exist but are disabled and return `410 Gone`. They used to sign with the server's own key and accepted any file from anyone. Uploads now go from the browser straight to Shelby and are signed by the user's wallet.

The storage API is implemented separately from the read-oriented Shelby Developer API.

## Large Files: Parallel Chunksets

Shelby accepts a file as a series of chunksets (about 9 to 10 MB each). The browser sends them directly to the Shelby RPC.

Chunksets are sent several at a time by `runPool` (`lib/services/runPool.ts`):

- It starts with up to 4 chunksets in flight.
- When a chunkset fails and is retried, the allowed number in flight is halved, down to 1.
- After 8 successes in a row, it grows back by one, up to the starting value.
- A chunkset gets up to 6 attempts. Bad requests (such as 400, 401, 403, 404, 409 and 422) are not retried.
- The first chunkset that finally fails stops the upload.

This exists because Shelby closes a request that takes longer than 60 seconds ("408 Connection timed out"). On a slow connection, sending too many pieces at once leaves each one too little bandwidth. Slowing down fixes that.

Before the first chunkset is sent, the browser has to read the whole file to build its commitments. The progress bar reports this "Preparing" step as bytes read.

Total time is still limited by your upload speed.

---

## Storage API Routes

The current storage routes are:

```text
app/api/storage/
├── prepare-upload/route.ts
├── stream-upload/route.ts
├── finalize-upload/route.ts
└── upload/route.ts
```

Each route represents a different part of the upload system.

### Prepare Upload

**Route**

```text
/api/storage/prepare-upload
```

The prepare stage establishes the information required before the upload data is transmitted.

Conceptually:

```text
Upload Request
      |
      v
Prepare Upload
      |
      v
Upload Configuration
```

This stage exists so that the application can establish the upload context before transferring the actual data.

### Stream Upload

**Route**

```text
/api/storage/stream-upload
```

This route is disabled (`410 Gone`). The browser sends the data directly to Shelby (see Browser-Direct Upload).

The stage below describes the original design.

Conceptually:

```text
Prepared Upload
      |
      v
Stream Data
      |
      v
Storage Transfer
```

Streaming allows the application to process the upload as data is transferred rather than requiring the entire workflow to be treated as a single browser operation.

### Finalize Upload

**Route**

```text
/api/storage/finalize-upload
```

The finalize stage completes the upload workflow.

Conceptually:

```text
Storage Transfer
      |
      v
Finalize Upload
      |
      v
Completed Asset
```

This stage represents the final application-side step after the upload data has been transferred.

### Upload Entry Point

**Route**

```text
/api/storage/upload
```

This route is disabled (`410 Gone`). Upload requests are no longer accepted by the server, and every upload is signed by the user's own wallet.

## Upload Lifecycle

The complete storage workflow can be represented as:

```text
┌───────────────────────────┐
│        User Selects       │
│          File             │
└─────────────┬─────────────┘
              |
              v
┌───────────────────────────┐
│       Prepare Upload      │
│                           │
│ /api/storage/             │
│ prepare-upload            │
└─────────────┬─────────────┘
              |
              v
┌───────────────────────────┐
│       Stream Upload       │
│                           │
│ /api/storage/             │
│ stream-upload             │
└─────────────┬─────────────┘
              |
              v
┌───────────────────────────┐
│      Finalize Upload      │
│                           │
│ /api/storage/             │
│ finalize-upload           │
└─────────────┬─────────────┘
              |
              v
┌───────────────────────────┐
│       Shelby Storage      │
└───────────────────────────┘
```

## Server-Side Storage Layer

The storage routes are part of the server-side application layer.

The browser does not need to communicate directly with the underlying storage implementation for every stage of the workflow.

The architecture is:

```text
Browser
   |
   v
Shelby Studio
   |
   +-- Storage API
   |
   v
Shelby Integration
   |
   v
Shelby Storage
```

This separation keeps storage-specific operations behind the application API.

## Upload and Developer APIs

Shelby Studio separates upload operations from developer read/inspection operations.

### Storage API

```text
/api/storage/*
```

Responsible for upload workflows.

### Developer Shelby API

```text
/api/shelby/*
```

Responsible for operations such as:

- Listing assets
- Inspecting assets
- Looking up objects
- Listing locations
- Downloading assets

The distinction can be represented as:

```text
                 Shelby Studio API
                       |
          ┌────────────┴────────────┐
          |                         |
          v                         v
    /api/storage/*             /api/shelby/*
          |                         |
          v                         v
    Upload Pipeline          Developer Operations
```

## Upload Pipeline Components

The upload workflow connects to the broader Shelby Studio application through the storage layer.

The major conceptual components are:

```text
Upload UI
   |
   v
Upload Controller
   |
   v
Storage API
   |
   +-- Prepare
   +-- Stream
   +-- Finalize
   |
   v
Shelby Storage
```

The exact UI component responsible for initiating an upload may evolve independently from the server-side storage routes.

## Upload Errors

Upload operations can fail at different stages.

Potential failure points include:

```text
Prepare
   |
   +-- Configuration failure
   |
   v
Stream
   |
   +-- Transfer failure
   |
   v
Finalize
   |
   +-- Completion failure
```

Applications using the upload pipeline should surface meaningful errors to the user and avoid treating a partially completed upload as a successful upload.

## Upload Completion

An upload should only be considered complete after the finalization stage succeeds.

The conceptual state progression is:

```text
Pending
   |
   v
Prepared
   |
   v
Uploading
   |
   v
Transferred
   |
   v
Finalized
```

The finalized state represents the completed application-side upload workflow.

## Relationship to Explorer

After an asset has been successfully uploaded, it can become part of the assets exposed through the Explorer and Developer API.

The broader workflow is:

```text
Upload
  |
  v
Shelby Storage
  |
  v
Stored Asset
  |
  v
Explorer
  |
  v
Inspect / Search / Filter
```

This connects the write path with the read and inspection paths of Shelby Studio.

## Relationship to Developer Platform

The Developer Platform exposes read-oriented operations for interacting with assets after they are available through the storage integration.

For example:

```text
Upload
   |
   v
/api/storage/*
   |
   v
Stored Asset
   |
   v
/api/shelby/assets
   |
   +-- Inspect
   +-- Object Lookup
   +-- Download
```

The Developer API therefore complements rather than replaces the upload pipeline.

## Storage Architecture

The storage architecture can be summarized as:

```text
┌──────────────────────────────┐
│          Shelby Studio       │
│                              │
│  Upload UI                   │
│  Developer Workspace         │
│  Explorer                    │
└──────────────┬───────────────┘
               |
       ┌───────┴────────┐
       |                |
       v                v
/api/storage/*     /api/shelby/*
       |                |
       v                v
 Upload Pipeline    Read / Inspect
       |                |
       └───────┬────────┘
               |
               v
       Shelby Integration
               |
               v
         Shelby Storage
```

## Current Implementation

The current storage API contains four route handlers:

```text
app/api/storage/prepare-upload/route.ts
app/api/storage/stream-upload/route.ts
app/api/storage/finalize-upload/route.ts
app/api/storage/upload/route.ts
```

The Developer Platform contains five corresponding read-oriented Shelby routes:

```text
app/api/shelby/assets/route.ts
app/api/shelby/asset/route.ts
app/api/shelby/object/route.ts
app/api/shelby/locations/route.ts
app/api/shelby/download/route.ts
```

Together these provide the application's primary storage write and read surfaces.

## Design Principles

The upload pipeline follows several architectural principles:

### Separation of Concerns

Upload operations remain under:

```text
/api/storage/*
```

while developer inspection operations remain under:

```text
/api/shelby/*
```

### Server-Side Integration

Storage-specific operations are handled through the server-side application layer.

### Explicit Lifecycle

The upload process is represented as distinct preparation, streaming, and finalization stages.

### Inspectability

Successfully stored assets can subsequently be exposed through the Explorer and Developer Platform.

## Current Scope

The upload pipeline currently documents:

- Upload preparation
- Upload streaming
- Upload finalization
- Upload entry point
- Server-side storage integration
- Storage API separation
- Relationship between uploads and stored assets
- Relationship between storage and Developer APIs
- Upload lifecycle
- Upload architecture

The implementation should remain the source of truth for the exact behavior of individual storage routes.
