# Engineering Decisions

> [!IMPORTANT]
>
> **Version:** v0.1.0
>
> **Status:** Active Development
>
>
> This document explains the engineering decisions that shape the architecture and implementation of Shelby Studio.
>
> Rather than documenting individual features, it explains the principles behind how the platform is designed and why specific architectural choices were made.

---

# Contents

1. Philosophy
2. Design Principles
3. Architectural Decisions
4. Storage Decisions
5. Security Decisions
6. Scalability
7. Future Evolution

---

# Philosophy

Shelby Studio is designed as a long-term developer platform rather than a collection of isolated features.

Every engineering decision is evaluated against four questions.

- Does it simplify the developer experience?
- Does it improve maintainability?
- Does it reduce unnecessary complexity?
- Can it scale as the platform grows?

If a solution fails one of these principles, it is reconsidered before implementation.

---

# Design Principles

The platform follows several core engineering principles.

## Separation of Concerns

Each subsystem has a clearly defined responsibility.

Examples include:

- Storage Engine
- Explorer
- Metadata
- Collections
- Dashboard

Each module can evolve independently without affecting the internal implementation of another.

---

## Hybrid Shelby Architecture

Server-only Shelby credentials and configuration remain isolated from the browser.

Next.js API routes handle preparation and coordination, while the browser performs required Shelby upload operations and the connected Aptos wallet authorizes blockchain transactions.

This reduces the attack surface while allowing future authentication and permission systems to be introduced without redesigning the application.

---

## Modular Development

Rather than building one large application, Shelby Studio is composed of independent modules.

Each module is responsible for solving a specific problem.

This allows future capabilities to be added without introducing unnecessary coupling.

---

# Architectural Decisions

Several architectural decisions influence how Shelby Studio operates.

---

## Layered Architecture

The application is divided into distinct layers.

```text
Browser

↓

React Interface

↓

Next.js API Routes

↓

Shelby SDK

↓

Shelby Network
```

The layers have explicit responsibilities, while the upload pipeline can coordinate across API routes, Shelby providers and the connected wallet.

This creates a predictable and maintainable architecture.

---

## API Boundary

The browser communicates with Shelby where required by the storage upload pipeline.

The current boundary is:

Browser

├── Next.js API Routes

├── Shelby Upload Providers

└── Connected Aptos Wallet

↓

Shelbynet

This separates server-only configuration from user-authorized operations while allowing the connected wallet to remain the transaction sender.

---

# Storage Decisions

Storage operations are intentionally designed to prioritize correctness over speed.

---

## Upload Verification

Uploading a file does not automatically mean the object exists.

After every upload, Shelby Studio verifies the object before presenting it inside the application.

This avoids displaying assets that were not successfully committed.

---

## Object Replacement

Object replacement is currently in progress.

The planned replacement workflow will be implemented only after its behavior has been validated against the current Shelby SDK and Shelbynet.

Until then, replacement is not presented as an implemented storage capability.

---

## Shelby as the Source of Truth

Local application state is considered temporary.

Whenever verification is required, Shelby is queried directly to confirm the current state of an object.

This reduces inconsistencies between the application and decentralized storage.

---

# Security Decisions

Security has been considered throughout the architecture.

Current decisions include:

- Server-side credentials
- API isolation
- Verified storage operations
- Controlled communication with Shelby
- Separation between client and storage infrastructure

These decisions prepare Shelby Studio for future authentication and multi-user environments.

---

# Scalability

Shelby Studio has been designed with future growth in mind.

Future modules can be introduced without redesigning the existing architecture.

Examples include:

- Analytics
- Version History
- Team Workspaces
- AI Assistant
- Portfolio Management
- Marketplace Integrations

The modular architecture allows these capabilities to integrate naturally with the existing platform.

---

# Future Evolution

Shelby Studio will continue evolving through incremental improvements rather than major architectural rewrites.

Current priorities include:

- Delete operations
- Metadata management
- Collection Builder
- Dashboard expansion

Long-term priorities include:

- NFT deployment workflows
- Version history
- Recovery tools
- AI-assisted development
- Collaboration features

---

# Closing Notes

Engineering is not only about writing code.

It is about designing systems that remain understandable, maintainable and adaptable as requirements evolve.

Shelby Studio is being developed with that philosophy in mind.

Every subsystem has been designed to support future expansion while maintaining a consistent developer experience.

---
