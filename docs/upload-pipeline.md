# Upload Pipeline

> [!IMPORTANT]
> **Project:** Shelby Studio
>
> **Version:** v0.1.0
>
> **Status:** Active Development
>
> **Maintainer:** Daviddforth
>
> This document describes how Shelby Studio uploads assets to the Shelby network.
>
> Sections marked **Current Implementation** represent functionality available today.
>
> Sections marked **Planned** describe future improvements.

---

# Contents

1. Overview
2. Objectives
3. Upload Lifecycle
4. Pipeline Architecture
5. Verification
6. Error Handling
7. Current Implementation
8. Planned Improvements
9. Related Documentation

---

# Overview

Uploading a file to Shelby involves more than simply transferring bytes.

Before an asset becomes available for download, it passes through multiple stages including registration, commitment generation, decentralized upload and on-chain verification.

Shelby Studio abstracts these operations into a predictable workflow while preserving the transparency of the underlying storage process.

---

# Objectives

The Upload Pipeline is designed to:

- Simplify decentralized uploads.
- Protect storage credentials.
- Verify completed uploads.
- Reduce failed storage operations.
- Prepare assets for future versioning.

---

# Upload Lifecycle

Every upload follows the same sequence.

```text
User Selects File
        │
        ▼
Client Validation
        │
        ▼
API Upload Request
        │
        ▼
Generate Commitments
        │
        ▼
Register Blob
        │
        ▼
Upload Chunksets
        │
        ▼
Commit Object
        │
        ▼
Verify Stored Object
        │
        ▼
Update Explorer
```

Each stage completes before the next begins, ensuring uploads remain reliable and verifiable.

---

# Pipeline Architecture

```text
Browser
   │
   ▼
Storage Page
   │
   ▼
Upload API Route
   │
   ▼
Shelby SDK
   │
   ├────────► Coordination
   │
   └────────► RPC
                  │
                  ▼
             Shelby Network
```

The browser never communicates directly with Shelby.

All communication passes through secure server-side API routes.

---

# Commitment Generation

Before a file can be uploaded, Shelby Studio generates cryptographic commitments for the asset.

These commitments allow Shelby to verify that uploaded data matches the object registered on-chain.

Commitment generation occurs entirely within the upload pipeline before any storage providers receive data.

---

# Blob Registration

Once commitments have been generated, the object is registered with Shelby.

Registration creates a pending object and assigns it a unique identifier (UID).

The object is not yet downloadable at this stage.

---

# Chunkset Upload

After registration, the file is divided into chunksets and uploaded through Shelby RPC.

Storage provider acknowledgements are collected during this process.

These acknowledgements are required before the object can be committed.

---

# Commit

After all chunksets have been successfully uploaded, Shelby Studio commits the object.

The commit operation binds the uploaded data to the registered object.

Only after this stage is complete does the object become available for retrieval.

---

# Verification

Verification is an intentional design decision.

Rather than assuming a successful upload because the commit transaction completed, Shelby Studio queries Shelby again to confirm that the object exists and that its metadata is consistent.

Only verified objects are displayed inside the application.

---

# Error Handling

The upload pipeline validates failures at multiple stages.

Examples include:

- Invalid file selection
- Registration failures
- Upload interruptions
- Commit failures
- Verification failures

These checks reduce the likelihood of incomplete or inconsistent uploads.

---

# Current Implementation

The upload pipeline currently supports:

✅ File upload

✅ Commitment generation

✅ Blob registration

✅ Chunkset upload

✅ Object commit

✅ Verification

✅ Explorer integration

These features represent the current production upload workflow.

---

# Planned Improvements

Future enhancements include:

- Drag-and-drop queue management
- Batch uploads
- Upload progress history
- Resumable uploads
- Automatic retries
- Upload cancellation
- Background synchronization

These improvements will build upon the existing upload architecture without changing its core workflow.

---

# Related Documentation

- Introduction
- Architecture
- Storage Engine
- Explorer
- Engineering Decisions

---

## Summary

The Upload Pipeline transforms a selected file into a verified Shelby object through a structured sequence of registration, upload, commitment and verification.

By validating every stage before exposing the object to the user, Shelby Studio provides a reliable and transparent upload experience while remaining fully aligned with Shelby's decentralized storage architecture.

---

**Document Version:** v0.1.0

**Project:** Shelby Studio

**Maintainer:** Daviddforth
