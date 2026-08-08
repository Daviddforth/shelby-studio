# Engineering Decisions

Shelby Studio is being developed as a modular, project-centric developer workspace for applications and digital assets built on Shelby. This document records the major engineering decisions that shape the current implementation and the direction of future development.

The goal is to make important architectural choices understandable and maintainable as the project grows.

## 1. Next.js as the Application Framework

Shelby Studio uses Next.js with the App Router as its primary application framework, combining:

- Browser-based application pages
- Server-rendered functionality
- Client-side interactions
- API routes
- Documentation pages
- Server-side integrations

The application does not require a separate frontend and backend project for its current requirements — the frontend and server-side API layer are maintained within the same repository and deployment.

## 2. Hybrid Browser and Server Architecture

Shelby Studio uses both browser-side and server-side operations.

**Browser** — operations requiring direct user interaction:

- Wallet connection
- Wallet signing
- Client-side workspace interaction
- Supported direct Shelby uploads
- User interface state

**Server** — operations requiring protected credentials or server-side processing.

```
Browser
│
├── UI
├── Wallet
├── Client State
└── Direct User Operations
        │
        ▼
Next.js Server
│
├── API Routes
├── Protected Credentials
└── Server-Side Shelby Operations
```

This avoids unnecessarily creating a separate backend service while still protecting sensitive operations.

## 3. Server-Side Secrets

Protected Shelby credentials remain server-side:

- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

These are accessed through server-side environment variables and are intentionally **not** exposed through `NEXT_PUBLIC_*` variables. The repository contains only configuration templates or references — actual secret values belong in the deployment environment or local environment configuration and must not be committed to Git.

## 4. Wallet-Controlled Transactions

Blockchain transactions requiring the user's authority are controlled by the user's connected wallet. The application does not treat the server as the user's wallet:

```
User → Connected Wallet → Transaction Approval → Shelby / Aptos
```

This preserves user control over transactions and prevents the application from silently signing on behalf of users. Server-side operations may prepare or support a transaction, but user-authorized blockchain actions remain subject to wallet approval.

## 5. Aptos Wallet Integration

Shelby Studio uses the Aptos wallet ecosystem for wallet interaction. The wallet layer provides:

- Wallet connection
- Wallet address
- Connection state
- Transaction signing
- Transaction submission
- Wallet-aware application state

Wallet functionality is made available through the application context so project, storage, explorer, and publication workflows can respond to the connected wallet.

## 6. Wallet-Aware Workspace State

The connected wallet is an important workspace boundary, particularly for project and asset information. The application avoids showing wallet-specific workspace information when the wallet that owns the workspace is no longer connected:

```
Wallet
  │
  ▼
Workspace State
  │
  ▼
Project
  │
  ├── Assets
  ├── Metadata
  ├── Collections
  └── Publication
```

This reduces the possibility of stale project state being displayed after wallet changes.

## 7. Project-Centric Architecture

Projects are the primary organizational boundary within Shelby Studio. Rather than treating storage, metadata, collections, and publication as unrelated global features, the application associates them with projects:

```
Project
│
├── Assets
├── Storage
├── Metadata
├── Collections
├── Activity
└── Publication
```

This makes it possible to build a complete development workflow around a specific application or asset collection, and provides a foundation for future project export, synchronization, collaboration, and versioning.

## 8. Separation of Domain Responsibilities

Major application areas have separate responsibilities:

- **Projects** — organize development workspaces
- **Storage** — manage decentralized asset storage
- **Explorer** — browse and inspect assets
- **Metadata** — create and validate metadata
- **Collections** — organize related assets
- **Portfolio** — present published project information
- **Publication** — track project publication state
- **Developer** — provide developer-oriented tools
- **AI** — foundation for future AI-assisted workflows

This separation prevents one module from becoming responsible for unrelated application concerns.

## 9. Component-Oriented UI

The application uses feature-oriented React components:

```
components/
├── dashboard/
├── storage/
├── explorer/
├── projects/
├── portfolio/
├── metadata/
├── collections/
├── developer/
├── ai/
├── profile/
├── wallet/
├── docs/
├── layout/
├── shared/
└── ui/
```

This structure allows features to evolve independently. Reusable interface primitives are maintained separately under `components/ui/` — e.g. Button, Card, Badge, Input, Select, Modal, EmptyState, Loading, StatCard — to avoid duplicating common interface behavior across feature modules.

## 10. Domain Logic Outside UI Components

Important application logic is kept outside presentation components where practical. The `lib` directory contains domain and infrastructure functionality:

```
lib/
├── core/
├── project/
├── publish/
├── services/
├── shelby/
└── sync/
```

This lets UI components focus primarily on presentation and interaction while reusable logic remains accessible to other parts of the application.

## 11. Shelby Integration Layer

Shelby-specific integration is separated into dedicated modules:

```
lib/shelby/
├── client.ts
├── collections.ts
├── config.ts
├── metadata.ts
├── storage.ts
└── wallet.ts
```

Additional specialized workflows exist under `lib/services/`. This keeps protocol-specific logic from being scattered throughout the user interface.

## 12. Multiple Storage Paths

Shelby Studio supports different storage workflows rather than forcing every upload through a single path:

```
lib/services/
├── shelbyBrowserDirectUpload.ts
├── shelbyLargeUpload.ts
├── shelbyStreamingUpload.ts
└── storage.ts
```

The browser-direct workflow is particularly important for large files, since it can avoid unnecessarily routing the entire file through the Next.js server.

## 13. Browser-Direct Large Uploads

For supported large-file workflows, the browser communicates directly with Shelby after the application server prepares the required operation:

```
User
 │
 ▼
Browser
 │
 ├── Prepare file
 ├── Generate commitments
 │
 ▼
Next.js API
 │
 └── Prepare operation
 │
 ▼
Browser
 │
 ├── Wallet authorization
 └── Direct data transfer
 │
 ▼
Shelby
 │
 ▼
Finalize
```

The application server does not necessarily need to receive the complete file payload, reducing unnecessary server bandwidth and making large-file workflows more efficient.

## 14. API Routes for Protected Operations

Next.js API routes provide server-side application functionality:

```
app/api/shelby/
├── asset/
├── assets/
├── download/
├── locations/
└── object/

app/api/storage/
├── finalize-upload/
├── prepare-upload/
├── stream-upload/
└── upload/
```

These routes provide a controlled server-side boundary for operations requiring protected configuration or server-side Shelby interaction.

## 15. Publication as a State Machine

Publication is not represented as a simple assumption that a project is published. A project can move through different stages:

```
Draft → Validation → Preparing → Registering → Committing → Published
```

A project may also encounter failure or incomplete states during the workflow. Publication information is therefore stored and interpreted as structured state.

## 16. Derived Publication Status

Publication status is derived from actual project and publication information — the application contains publication utilities for determining publication state rather than relying on a hardcoded success flag. The project view layer uses publication information to construct the data displayed by project interfaces.

This matters because the presence of a publication record does not necessarily mean every required publication step has completed.

## 17. Project View Model

The project view layer provides a normalized representation of project information for the user interface:

```
lib/project/
├── projectView.ts
├── publication.ts
└── PublicationTimeline.tsx
```

This allows interface components to consume consistent information — project identity, owner, network, assets, storage information, publication state, transaction information, storage URI, explorer information — reducing the need for multiple components to independently reconstruct project state.

## 18. Explorer as a Workspace Interface

Explorer provides a focused interface for browsing and inspecting assets:

```
Explorer
│
├── Header
├── Search
├── Filters
├── Sorting
├── Asset Table
├── Asset Rows
├── Empty State
└── Published Project Views
```

Current sorting options: Newest, Oldest, Name A-Z, Largest, Smallest. Explorer is wallet-aware and should not expose workspace-specific asset information without the appropriate wallet context.

## 19. Portfolio as a Presentation Layer

Portfolio is separated from the internal project workspace, presenting published project information in a more public-facing format. Current functionality includes components for portfolio header, portfolio statistics, published project cards, published project grids, project details, empty states, and NFT presentation.

This separation allows internal project management and public project presentation to evolve independently.

## 20. Metadata and Storage Separation

Metadata and storage are intentionally separate systems. Storage answers *where is the asset stored?* Metadata answers *what does the asset represent?*

```
Asset
 │
 ├── Storage
 │     └── Shelby Asset
 │
 └── Metadata
       └── NFT Description
```

This lets developers update metadata without necessarily changing the underlying stored asset, and lets storage functionality remain useful for applications that don't use NFT metadata.

## 21. Collections as an Organizational Layer

Collections provide an organizational layer between individual assets and projects:

```
Project
 │
 └── Collection
       │
       ├── Assets
       ├── Metadata
       ├── Branding
       └── Preview
```

Collections don't own the underlying storage system — they organize project assets while relying on the Storage and Metadata modules for their respective responsibilities.

## 22. Local State as the Current Workspace Foundation

The current application uses client-side state and project context to support workspace functionality. This keeps the current architecture lightweight, but also means the application should not yet be described as having a full persistent multi-device backend. Future infrastructure may introduce persistent project storage, databases, indexing, and synchronization when required.

## 23. Synchronization Foundation

The project contains synchronization utilities under:

```
lib/sync/
├── cache.ts
├── offline.ts
├── queue.ts
└── sync.ts
```

These provide a foundation for future synchronization and offline workflows and should not currently be interpreted as a complete distributed synchronization system. The architecture intentionally leaves room for these capabilities to expand as persistent infrastructure is introduced.

## 24. Avoiding Unnecessary Backend Infrastructure

A separate backend service is not currently required for the core application — Next.js already provides frontend and server-side API routes within the same application.

A separate backend may become appropriate if Shelby Studio later requires infrastructure such as long-running workers, persistent database services, global asset indexing, background Shelby monitoring, large-scale analytics, real-time collaboration, or organization-level access control. The decision should be driven by actual product requirements rather than introducing infrastructure prematurely.

## 25. Security Boundary

The application maintains a clear browser/server security boundary:

```
PUBLIC
│
├── UI
├── Client State
├── Wallet Interaction
├── Public Configuration
└── Browser-Supported Operations

          │
          ▼

PRIVATE
│
├── API Credentials
├── Private Signing Material
├── Protected Server Operations
└── Server-Only Configuration
```

Anything exposed through `NEXT_PUBLIC_*` should be considered browser-visible. Sensitive credentials must remain server-side.

## 26. Environment Configuration

The local development environment contains server-side credentials and browser-visible configuration separately.

**Server-side configuration:**
- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

**Browser-visible configuration** may use `NEXT_PUBLIC_*` variables where necessary.

Environment files containing real values are excluded from Git through the repository's environment-file ignore rules.

## 27. Documentation as an Engineering Tool

Documentation is treated as part of the engineering process rather than an afterthought, describing architecture, storage, upload workflows, Explorer behavior, metadata, collections, dashboard behavior, and engineering decisions.

Documentation should distinguish between **Current Implementation** and **Planned Development** to prevent future functionality from being presented as if it already exists.

## 28. Open Development

Shelby Studio is structured as an open developer platform. The source repository can contain application source code, components, domain logic, documentation, configuration templates, and engineering decisions.

However, secrets must never be included in the repository. This includes private keys, API secrets, wallet seed phrases, passwords, deployment credentials, and other authentication secrets.

## 29. Current Architectural Priorities

- Maintain reliable Shelby storage workflows
- Keep wallet interactions user-controlled
- Maintain project-aware application state
- Keep publication state derived from real information
- Keep server-only credentials protected
- Maintain modular feature boundaries
- Keep the application deployable without unnecessary infrastructure
- Keep documentation aligned with actual implementation

## 30. Planned Engineering Direction

As Shelby Studio evolves, engineering work may introduce:

- Persistent project storage
- Database-backed workspaces
- Global Shelby asset indexing
- Background workers
- Cross-device synchronization
- Project versioning
- Recovery workflows
- Team workspaces
- Permission systems
- Analytics
- Audit history
- Advanced publication tooling
- Expanded developer APIs
- AI-assisted workflows

These are future architectural possibilities and should not be interpreted as current infrastructure.

## 31. Decision-Making Principles

- **Solve the Current Problem** — do not introduce infrastructure without a concrete requirement.
- **Protect User Authority** — users should remain in control of wallet-authorized blockchain transactions.
- **Protect Secrets** — sensitive credentials should remain on trusted server infrastructure.
- **Prefer Clear Boundaries** — UI, state, domain logic, and infrastructure should have understandable responsibilities.
- **Prefer Derived State** — important status indicators should come from actual application data rather than assumptions.
- **Design for Extension** — new functionality should be added through modular systems where practical.
- **Document Important Changes** — major architectural changes should be reflected in the engineering documentation.

## Summary

Shelby Studio is built as a modular Next.js application with a hybrid browser/server architecture. The current engineering approach prioritizes:

- Project-centric organization
- Wallet-controlled transactions
- Secure server-side credentials
- Modular feature boundaries
- Shelby-specific integration layers
- Multiple storage workflows
- Derived publication state
- Lightweight infrastructure
- Clear documentation

The architecture is intentionally designed to support the current product without introducing unnecessary backend complexity. As requirements grow, persistent databases, indexing services, background workers, synchronization infrastructure, collaboration systems, analytics, and additional backend services can be introduced incrementally.

The fundamental architectural principle remains the same: build a reliable, understandable developer workspace around Shelby while keeping user authority, security, modularity, and future extensibility at the center of the system.