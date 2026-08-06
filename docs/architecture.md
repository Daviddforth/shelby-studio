# Architecture

> [!IMPORTANT]
>
> **Version:** v0.1.0
>
> **Status:** Active Development
>
>
> This document describes the architecture of Shelby Studio.
>
> Sections marked **Current Implementation** represent functionality available today.
>
> Sections marked **Planned** describe the intended evolution of the platform.

---

# Contents

1. Overview
2. Architectural Goals
3. System Architecture
4. Core Components
5. Current Implementation
6. Planned Architecture
7. Design Principles
8. Related Documentation

---

# Overview

Shelby Studio follows a layered architecture that separates presentation, application logic, API services and decentralized storage.

Each layer has a clearly defined responsibility, allowing the application to remain modular, maintainable and scalable as new capabilities are introduced.

Shelby Studio uses a hybrid architecture. Next.js API routes prepare and coordinate storage operations, while the browser performs the Shelby data-transfer stages required by the upload pipeline and the connected Aptos wallet signs on-chain transactions.

---

# Architectural Goals

The architecture was designed with several primary objectives.

- Maintain a clear separation of concerns.
- Protect sensitive credentials.
- Support future expansion.
- Keep individual modules independent.
- Reduce coupling between features.
- Enable reusable services.

---

# System Architecture

```text
+------------------------------+
|        Web Browser           |
| (React + Next.js Interface)  |
+--------------+---------------+
               |
               v
+------------------------------+
|     React Components         |
+--------------+---------------+
               |
               v
+------------------------------+
|      Context Providers       |
| Wallet • Storage • Projects  |
+--------------+---------------+
               |
               v
+------------------------------+
|      Next.js API Routes      |
+--------------+---------------+
               |
               v
+------------------------------+
|        Shelby SDK            |
+------+----------------+------+
       |                |
       v                v
 Shelby Coordination   Shelby RPC
       \                /
        \              /
         v            v
        Shelby Network
```

---

# Core Components

## User Interface

The frontend provides an intuitive interface for interacting with Shelby services.

Current pages include:

- Dashboard
- Storage
- Explorer
- Projects

Future pages include:

- Metadata
- Collections
- Portfolio
- Analytics

---

## Context Providers

Application state is shared through React Context Providers.

Current providers:

- Wallet Context
- Storage Context

Planned providers:

- Metadata Context
- Collection Context
- Dashboard Context

---

## API Layer

The API layer acts as the secure gateway between the frontend and Shelby.

Responsibilities include:

- Upload processing
- Download requests
- Object queries
- Upload preparation and coordination
- Future deletion operations

Sensitive credentials remain isolated within this layer.

---

## Shelby Integration

Shelby Studio integrates with multiple Shelby services.

Current integrations include:

- Shelby Coordination
- Shelby RPC
- Shelby SDK

These services collectively enable decentralized object storage and retrieval.

---

# Current Implementation

The architecture currently supports:

- Secure uploads
- Object queries
- Downloads
- Wallet-signed storage transactions
- Asset verification

Shelby communication is split between server-side coordination and browser-side storage operations. The connected wallet remains the sender for registration and commit transactions.

---

# Planned Architecture

Future versions will expand the architecture with additional subsystems.

Examples include:

- Metadata Engine
- Collection Engine
- Analytics Service
- Version History
- Recovery Service
- Portfolio Manager
- AI Assistant

These additions are designed to integrate without requiring significant architectural changes.

---

# Design Principles

Shelby Studio follows several architectural principles.

## Separation of Concerns

Each layer performs one responsibility.

## Security

Server-only configuration remains isolated from the browser, while user-authorized blockchain transactions are signed by the connected wallet.

## Modularity

Every subsystem is independently maintainable.

## Scalability

New functionality should integrate without disrupting existing components.

## Reliability

Critical operations are verified before updating the user interface.

---

# Related Documentation

- Introduction
- Philosophy
- Storage Engine
- Upload Pipeline
- Explorer
- Metadata
- Collections
- Dashboard
- Engineering Decisions

---

## Summary

The architecture of Shelby Studio has been designed to support both the current implementation and future expansion.

By separating presentation, business logic and decentralized storage into independent layers, the platform provides a secure and maintainable foundation for developers building on Shelby.

---
