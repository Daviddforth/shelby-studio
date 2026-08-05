# Explorer

> [!IMPORTANT]
> **Project:** Shelby Studio
>
> **Version:** v0.1.0
>
> **Status:** Active Development
>
> **Maintainer:** Daviddforth
>
> This document describes the Explorer module of Shelby Studio.
>
> Sections marked **Current Implementation** describe features available today.
>
> Sections marked **Planned** describe capabilities currently under development.

---

# Contents

1. Overview
2. Objectives
3. Design Philosophy
4. Explorer Architecture
5. Current Features
6. Asset Lifecycle
7. Planned Features
8. Related Documentation

---

# Overview

The Explorer is the primary interface for viewing and managing assets stored through Shelby Studio.

Rather than acting as a traditional file browser, the Explorer provides a structured workspace for interacting with decentralized storage objects throughout their lifecycle.

It allows developers to inspect uploaded assets, verify stored objects and perform storage operations from a single location.

---

# Objectives

The Explorer is designed to:

- Display uploaded assets.
- Simplify asset management.
- Provide direct access to storage operations.
- Present verified Shelby object information.
- Maintain synchronization with the current workspace.

The Explorer intentionally focuses on asset management while delegating storage operations to the server-side API layer.

---

# Design Philosophy

The Explorer follows three core principles.

## Visibility

Developers should immediately understand what assets exist inside their workspace.

---

## Verification

Displayed information should reflect verified Shelby data rather than assumptions made by the client.

---

## Simplicity

Frequently used operations should require as few interactions as possible while still exposing useful technical information.

---

# Explorer Architecture

```text
                Explorer

         +----------------------+
         |   Asset Table         |
         +----------+-----------+
                    |
                    v
         +----------------------+
         |     Asset Row        |
         +----------+-----------+
                    |
     +--------------+--------------+
     |              |              |
     v              v              v
 Download        Replace        Delete*
                    |
                    v
           Next.js API Routes
                    |
                    v
              Shelby SDK
                    |
                    v
               Shelby Network

*Planned
```

The Explorer acts as the presentation layer while storage operations are handled through secure API routes.

---

# Current Features

The current implementation provides:

### Asset Listing

Display uploaded assets stored within the current workspace.

---

### Search

Filter assets by name using case-insensitive matching.

---

### Download

Retrieve the latest committed version of an asset directly from Shelby.

---

### Replace

Replace an existing object while preserving its blob name.

Shelby Studio performs an atomic replacement and verifies the object before updating the interface.

---

### Verification

Asset information displayed in the Explorer is retrieved from Shelby rather than relying solely on local application state.

---

# Asset Lifecycle

An asset typically progresses through the following stages.

```text
Upload

↓

Verification

↓

Explorer

↓

Download

↓

Replace

↓

Verification

↓

Explorer Refresh
```

This lifecycle ensures the Explorer always reflects the latest verified state of the object.

---

# Planned Features

The following Explorer capabilities are currently under development.

### Asset Management

- Delete objects
- Batch deletion
- Batch replacement
- Batch downloads

---

### Visualization

- Image thumbnails
- Preview modal
- File type icons

---

### Productivity

- Sorting
- Pagination
- Multi-select
- Bulk operations

---

### Versioning

- Object history
- Previous versions
- Rollback support

These features will expand the Explorer while preserving its current architecture.

---

# Engineering Notes

The Explorer intentionally separates presentation from storage operations.

Rather than communicating directly with Shelby, every action passes through server-side API routes.

This approach:

- Protects sensitive credentials.
- Centralizes storage logic.
- Simplifies maintenance.
- Enables future authentication.

---

# Related Documentation

- Introduction
- Philosophy
- Architecture
- Storage Engine
- Upload Pipeline
- Engineering Decisions

---

## Summary

The Explorer provides the primary interface for interacting with stored Shelby assets.

By combining verified object information with streamlined storage operations, it enables developers to confidently manage decentralized assets while maintaining a clean and scalable user experience.

---

**Document Version:** v0.1.0

**Project:** Shelby Studio

**Maintainer:** Daviddforth
