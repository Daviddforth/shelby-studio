# Storage Engine

> [!IMPORTANT]
>
> **Version:** v0.1.0
>
> **Status:** Active Development
>
>
> This document describes how Shelby Studio stores, retrieves and manages digital assets using the Shelby network.
>
> Sections marked **Current Implementation** represent functionality available today.
>
> Sections marked **Planned** describe future capabilities.

---

# Contents

1. Overview
2. Objectives
3. Storage Philosophy
4. Storage Architecture
5. Upload Workflow
6. Download Workflow
7. Replace Workflow
8. Current Implementation
9. Planned Features
10. Related Documentation

---

# Overview

The Storage Engine is the foundation of Shelby Studio.

Every asset managed by Shelby Studio ultimately passes through the Storage Engine before being persisted on Shelby.

Rather than exposing low-level protocol operations directly to the user, the Storage Engine provides a structured workflow that simplifies uploads, downloads and asset management while preserving the reliability and transparency of Shelby's decentralized storage architecture.

---

# Objectives

The Storage Engine has several primary objectives.

- Provide reliable decentralized storage.
- Simplify complex storage workflows.
- Verify successful operations.
- Protect sensitive credentials.
- Support future scalability.

---

# Storage Philosophy

Storage should be predictable.

Every storage operation follows a clearly defined lifecycle.

Rather than assuming an operation succeeded because a request completed successfully, Shelby Studio verifies the resulting object before presenting it to the user.

This philosophy prioritizes correctness and confidence over raw execution speed.

---

# Storage Architecture

```text
+----------------------+
|      Browser         |
+----------+-----------+
           |
           v
+----------------------+
| Storage Interface    |
+----------+-----------+
           |
           v
+----------------------+
| Next.js API Routes   |
+----------+-----------+
           |
           v
+----------------------+
| Shelby SDK           |
+------+---------+-----+
       |         |
       v         v
Coordination    RPC
       \         /
        \       /
         v     v
        Shelbynet
```

The browser participates directly in Shelby storage operations where required by the upload pipeline.

Storage operations use a hybrid architecture combining Next.js API coordination, browser-side Shelby data transfer and connected-wallet transaction signing.

---

# Upload Workflow

Uploading an asset follows a multi-stage process.

```text
Select File
      │
      ▼
Create Storage Request
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
Verify Object
      │
      ▼
Update Explorer
```

This workflow ensures every uploaded asset is verified before appearing in the application.

---

# Download Workflow

Downloading an object follows a simpler process.

```text
User Request
      │
      ▼
Locate Object
      │
      ▼
Retrieve From Shelby
      │
      ▼
Validate Response
      │
      ▼
Return File
```

Downloads always retrieve the latest committed version of the object.

---

# Replace Workflow

> **Status: In Progress**

Object replacement is planned as an asset-management capability.

The intended workflow will preserve the logical identity of an object while replacing its stored contents.

```text
Existing Object
      │
      ▼
Register New Pending Blob
      │
      ▼
Upload Replacement Data
      │
      ▼
Commit Using Overwrite
      │
      ▼
Verify Replacement
      │
      ▼
Update Explorer
```

This approach avoids temporary storage gaps and ensures references remain valid throughout the replacement process.

---

# Current Implementation

The Storage Engine currently supports:

✅ Upload files

✅ Query object metadata

✅ Download objects

🚧 Object replacement

✅ Upload verification

✅ Object verification

Implemented storage capabilities use Shelby SDK integration, server-side preparation, browser-side data transfer and connected-wallet transaction signing.

---

# Planned Features

The Storage Engine will continue expanding with additional capabilities.

### Asset Management

- Delete objects
- Batch uploads
- Batch downloads
- Batch replacement

### Reliability

- Upload resume
- Retry handling
- Failure recovery
- Background synchronization

### Version Control

- Object history
- Previous versions
- Rollback support

### Recovery

- Recovery assistant
- Storage diagnostics
- Integrity reports

These additions will extend the Storage Engine while preserving its current architecture.

---

# Engineering Notes

Several engineering decisions influence the Storage Engine.

- Server-only credentials and configuration remain server-side.
- Verification occurs after critical operations.
- Replacement behavior remains under development.
- Shelby remains the source of truth for stored assets.
- Browser-side Shelby communication is used where required by the upload pipeline.

These decisions improve reliability, maintainability and security.

---

# Related Documentation

- Introduction
- Philosophy
- Architecture
- Upload Pipeline
- Explorer
- Engineering Decisions

---

## Summary

The Storage Engine is the core subsystem of Shelby Studio.

It provides a secure, modular and verifiable interface for interacting with Shelby while abstracting complex storage workflows into predictable developer experiences.

As Shelby Studio evolves, the Storage Engine will remain the foundation upon which higher-level features such as metadata management, collections and NFT workflows are built.

---
