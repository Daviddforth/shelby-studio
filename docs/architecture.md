# Architecture

Shelby Studio is a single Next.js application that combines a browser-based developer workspace, wallet integration, server-side API routes, application services, and Shelby/Aptos infrastructure.

The architecture is organized around a project-centric model. Projects connect assets, storage, metadata, collections, activity, and publication information while the application maintains clear boundaries between browser code and server-only operations.

---

## Architecture Overview

At a high level, Shelby Studio is structured as:

```text
                           Shelby Studio
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
           Browser                            Next.js Server
              │                                   │
      ┌───────┼────────┐                  ┌───────┼────────┐
      │       │        │                  │       │        │
     UI     Wallet   Client State        API   Services  Secrets
      │       │        │                  │       │
      └───────┴────────┘                  └───────┴────────┘
              │                                   │
              └─────────────────┬─────────────────┘
                                │
                       Shelby / Aptos
```

The browser and server are part of the same Next.js application. They are separated by responsibility rather than requiring two completely separate applications.

---

## Application Structure

The repository is organized into several major areas:

```text
shelby-studio/
│
├── app/
│   ├── application pages
│   ├── dynamic routes
│   ├── API routes
│   └── documentation routes
│
├── components/
│   ├── dashboard
│   ├── storage
│   ├── explorer
│   ├── projects
│   ├── portfolio
│   ├── metadata
│   ├── collections
│   ├── developer
│   ├── AI
│   ├── profile
│   ├── wallet
│   ├── layout
│   ├── shared
│   └── UI primitives
│
├── context/
│   ├── wallet state
│   ├── project state
│   └── application state
│
├── lib/
│   ├── core logic
│   ├── project logic
│   ├── publication logic
│   ├── publishing
│   ├── Shelby integration
│   ├── storage services
│   └── synchronization
│
└── docs/
    └── technical documentation
```

The separation allows interface components, state management, domain logic, infrastructure services, and external integrations to evolve independently.

---

## Application Layers

Shelby Studio can be understood as several logical layers.

```text
┌─────────────────────────────────────────────┐
│                  UI Layer                    │
│ Pages, components, layouts, documentation    │
├─────────────────────────────────────────────┤
│               State Layer                    │
│ Wallet, project, metadata, workspace state   │
├─────────────────────────────────────────────┤
│              Domain Layer                    │
│ Projects, publication, metadata, assets      │
├─────────────────────────────────────────────┤
│             Service Layer                    │
│ Storage, uploads, Shelby operations          │
├─────────────────────────────────────────────┤
│              API Layer                       │
│ Next.js server-side API routes               │
├─────────────────────────────────────────────┤
│          External Infrastructure             │
│ Shelby network and Aptos                     │
└─────────────────────────────────────────────┘
```

These are logical responsibilities rather than separate applications.

---

## Frontend Architecture

The frontend uses the Next.js App Router.

The main application routes include:

```text
/
├── about
├── ai
├── app
├── collections
├── dashboard
├── developer
├── docs
├── explorer
├── metadata
├── playground
├── portfolio
├── profile
├── projects
└── storage
```

Dynamic routes include:

```text
/projects/[id]
/portfolio/[id]
/docs/[slug]
```

These routes provide the primary navigation structure of the application.

---

## Feature Architecture

The frontend is organized around feature-specific component directories.

```text
components/
├── ai/
├── collections/
├── dashboard/
├── developer/
├── docs/
├── explorer/
├── landing/
├── layout/
├── metadata/
├── nft/
├── portfolio/
├── profile/
├── projects/
├── shared/
├── storage/
├── ui/
└── wallet/
```

Feature components are responsible for feature-specific presentation and interaction.

Shared components are kept separate so common interface behavior does not need to be recreated across every feature.

### Shared UI Layer

The `components/ui` directory contains reusable interface primitives, including:

- Button
- Card
- Badge
- Input
- Select
- Textarea
- Modal
- Loading
- LoadingSpinner
- EmptyState
- PageHeader
- Section
- StatCard

These components provide consistent interface behavior and styling across the application.

---

## State Architecture

Shelby Studio uses React state and application contexts to coordinate workspace information.

Important state areas include:

- Wallet state
- Project state
- Metadata state
- Workspace state
- Application UI state

The project state is particularly important because multiple modules depend on the active project.

---

## Wallet Architecture

Wallet functionality is integrated through the Aptos wallet ecosystem.

The wallet layer provides:

- Wallet connection
- Wallet connection state
- Connected wallet address
- Transaction signing
- Transaction submission
- Wallet-aware application state

The wallet provider is integrated at the application level so relevant pages and components can access wallet state.

### Wallet as an Authorization Boundary

The connected wallet is used for blockchain operations requiring user authorization. For example, a user may be required to approve a transaction before a Shelby operation can be completed.

The application therefore treats wallet interaction as a user-controlled authorization mechanism.

### Wallet as a Workspace Boundary

Wallet state also influences access to wallet-specific workspace information. When wallet-specific project or asset information is displayed, the application should ensure that the information belongs to the currently relevant wallet context.

This prevents stale workspace state from being presented after a wallet changes or disconnects.

---

## Project Architecture

Projects are the central organizational model in Shelby Studio.

A project can contain:

```text
Project
│
├── Identity
│   ├── ID
│   ├── Name
│   └── Description
│
├── Assets
│   └── Project Assets
│
├── Metadata
│   └── Metadata Records
│
├── Collections
│   └── Collection Information
│
├── Storage
│   ├── Storage Usage
│   └── Asset Records
│
├── Activity
│   └── Project Activity
│
└── Publication
    ├── Owner
    ├── Network
    ├── Manifest
    ├── Registration Transaction
    ├── Commit Transaction
    ├── Transaction Hash
    ├── Storage URI
    ├── Explorer URL
    └── Publication Status
```

This model allows different application modules to operate around the same project.

### Project State

Project state is managed through the project context and supporting project libraries.

The project layer provides functionality for:

- Creating projects
- Listing projects
- Selecting projects
- Reading the active project
- Updating project information
- Managing project assets
- Validating projects
- Importing projects
- Exporting projects
- Managing publication information

Project utilities are organized under the project-related libraries in `lib/project`.

### Project Routing

Projects are accessible through `/projects` and `/projects/[id]`.

The project listing provides the workspace for available projects. The dynamic project route provides the dashboard for an individual project.

Project access is wallet-aware. If the relevant wallet context is unavailable, the application should not continue exposing wallet-specific workspace information.

If a requested project cannot be resolved in the available project state, the application should display an appropriate project-not-found state rather than unrelated project information.

---

## Storage Architecture

Storage is one of the primary infrastructure layers of Shelby Studio.

The application contains services for:

- Uploading files
- Preparing uploads
- Streaming uploads
- Large-file uploads
- Browser-direct uploads
- Finalizing uploads
- Downloading assets
- Querying storage information
- Inspecting stored objects

Storage functionality is implemented through a combination of application services and Next.js API routes.

### Browser-Direct Storage

Shelby Studio includes a browser-direct upload service for supported large-file workflows. The purpose is to avoid unnecessarily routing large file payloads through the Next.js server.

A simplified workflow is:

```text
User selects file
       │
       ▼
     Browser
       │
       ├── Generate commitments
       │
       ├── Request server preparation
       ▼
   Next.js API
       │
       └── Prepare operation
       ▼
     Browser
       │
       ├── Wallet authorization
       ├── Data transfer
       ▼
     Shelby
       │
       ▼
   Finalization
       │
       ▼
Project / Asset State
```

The exact sequence depends on the storage operation. The important architectural principle is that large file data does not need to pass through the application server when a direct Shelby workflow is appropriate.

### Server-Assisted Storage

The Next.js server participates in storage workflows through API routes.

Current storage API areas include:

```text
app/api/storage/
├── finalize-upload/
├── prepare-upload/
├── stream-upload/
└── upload/
```

Shelby-specific API routes include:

```text
app/api/shelby/
├── asset/
├── assets/
├── download/
├── locations/
└── object/
```

These routes provide server-side access to operations that require application-controlled configuration or server-side Shelby integration.

---

## Shelby Integration Layer

Shelby-specific integration is separated into its own library areas.

The main Shelby integration directory contains:

```text
lib/shelby/
├── client.ts
├── collections.ts
├── config.ts
├── metadata.ts
├── storage.ts
└── wallet.ts
```

Specialized services are located under:

```text
lib/services/
├── shelbyBrowserDirectUpload.ts
├── shelbyLargeUpload.ts
├── shelbyStreamingUpload.ts
└── storage.ts
```

This separation prevents Shelby-specific infrastructure code from being tightly coupled to individual UI components.

---

## API Architecture

Next.js API routes provide the server-side boundary for application operations.

The general request flow is:

```text
Browser
   │
   │ HTTP Request
   ▼
Next.js API Route
   │
   ├── Validate request
   ├── Access server configuration
   ├── Execute server-side operation
   └── Return result
   │
   ▼
Browser
```

The API layer allows the application to expose functionality without exposing server-only credentials.

### Protected Credentials

Server-side credentials are accessed through server environment variables.

Current server-side configuration includes values such as:

- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

These values must remain server-side. They must not:

- Be committed to Git
- Be included in client-side code
- Use the `NEXT_PUBLIC_` prefix
- Be exposed through browser APIs

The repository ignores `.env*` files through `.gitignore`.

### Public Configuration

Variables using the `NEXT_PUBLIC_` prefix are intentionally available to browser-side code.

They should therefore never contain private keys, seed phrases, or other credentials that require secrecy.

Public configuration should be limited to information that is safe for users to inspect.

---

## Publication Architecture

Publication is implemented as a project-level workflow.

The publication system is responsible for:

- Validating a project
- Preparing publication
- Tracking publication records
- Determining publication status
- Determining publication completion
- Resolving transaction information
- Resolving storage information
- Building normalized project views
- Displaying publication progress and results

Relevant project publication logic is located under:

```text
lib/project/
├── publication.ts
├── projectView.ts
└── PublicationTimeline.tsx
```

Publication validation and types are located under:

```text
lib/publish/
├── types.ts
└── validateProject.ts
```

Publication UI components are located under:

```text
components/projects/publish/
├── PublishChecklist.tsx
├── PublishProjectModal.tsx
├── PublishSuccess.tsx
└── PublishSummary.tsx
```

### Publication State

Publication is treated as a workflow rather than a single boolean.

A publication record may contain:

- Owner
- Network
- Manifest Blob
- Registration Transaction
- Commit Transaction
- Transaction Hash
- Storage URI
- Explorer URL
- Publication Status

The application can therefore distinguish between different states of a project's publication process, for example:

- Not published
- Publication in progress
- Publication partially recorded
- Publication completed

The exact state is derived from the available project and publication information.

### Project View Layer

The project view layer normalizes project information for UI components.

The `buildProjectView` function converts a project into a `ProjectView`. The resulting view can contain:

- Project identity
- Description
- Project status
- Publication state
- Publication completion state
- Publication date
- Asset count
- Metadata count
- Collection count
- Storage usage
- Owner
- Network
- Manifest information
- Registration transaction
- Commit transaction
- Transaction hash
- Storage URI
- Explorer URL
- Publication status
- Project assets

This prevents individual UI components from independently reconstructing publication state.

---

## Explorer Architecture

Explorer provides a workspace-oriented interface for asset discovery and inspection.

```text
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

Current filter and sorting controls include:

**Status**
- All Assets
- Stored
- Failed

**Sorting**
- Newest
- Oldest
- Name A-Z
- Largest
- Smallest

Explorer is wallet-aware and can withhold workspace-specific asset information when the required wallet context is unavailable.

---

## Portfolio Architecture

Portfolio provides a presentation layer for published project information.

Current portfolio components include:

- Portfolio header
- Portfolio statistics
- Published project cards
- Published project grids
- Project details
- Empty states
- NFT-related presentation

Portfolio consumes project and publication information rather than maintaining an entirely separate project model. This keeps publication state and public project presentation connected.

---

## Metadata Architecture

Metadata functionality is organized into a dedicated metadata feature.

Current metadata components provide functionality for:

- NFT information
- Image uploads
- Attribute building
- Metadata templates
- Metadata validation
- JSON preview
- Metadata import
- Metadata actions
- NFT preview

Supporting metadata logic exists in the library layer.

Metadata is intended to operate within the project and collection workflow.

---

## Collection Architecture

Collections organize related project assets.

Current collection functionality includes:

- Collection information
- Collection assets
- Collection metadata
- Collection branding
- Collection preview
- Collection actions
- Active project context

Collections are intended to connect asset organization with NFT development workflows.

---

## Developer Architecture

The Developer area provides a foundation for developer tooling.

Current components include:

```text
components/developer/
├── APIPlayground.tsx
├── CodeGenerator.tsx
├── DeveloperHeader.tsx
├── Examples.tsx
└── SDKExplorer.tsx
```

The area is designed to evolve into a broader developer interface for interacting with Shelby services and APIs.

---

## AI Architecture

The AI area currently provides an interface foundation for AI-assisted workflows.

Current components include:

```text
components/ai/
├── AIChat.tsx
├── AIHeader.tsx
├── AIHistory.tsx
└── AIPrompts.tsx
```

The AI layer is separate from the core storage and project infrastructure. This allows AI functionality to evolve without becoming a dependency for core application workflows.

---

## Synchronization Architecture

Synchronization utilities are located under:

```text
lib/sync/
├── cache.ts
├── offline.ts
├── queue.ts
└── sync.ts
```

These modules provide a foundation for:

- Local caching
- Offline state
- Queued operations
- Synchronization

The current implementation should not be interpreted as a complete distributed synchronization service.

Persistent cross-device synchronization is a future architectural direction.

---

## Data Flow

A simplified storage workflow is:

```text
User
 │
 ▼
Shelby Studio UI
 │
 ▼
Wallet / Project Context
 │
 ▼
Storage Service
 │
 ├──────────────────────┐
 ▼                      ▼
Browser Direct       Next.js API
Flow                    │
 │                      │
 └──────────┬───────────┘
            ▼
         Shelby
            │
            ▼
      Storage Result
            │
            ▼
      Project / Asset State
            │
      ┌─────┼──────────┐
      ▼     ▼          ▼
 Explorer Dashboard  Portfolio
```

Publication builds on the project and storage layers:

```text
Project
   │
   ├── Assets
   ├── Metadata
   └── Storage
          │
          ▼
  Publication Validation
          │
          ▼
   Publication Workflow
          │
          ├── Registration
          ├── Commit
          └── Transaction Information
          │
          ▼
   Publication Record
          │
      ┌───┼───────────┐
      ▼   ▼           ▼
 Project Portfolio  Explorer
 Dashboard
```

---

## Application Lifecycle

A typical project workflow can be represented as:

```text
Connect Wallet
      │
      ▼
Create Project
      │
      ▼
Add Assets
      │
      ▼
Upload to Shelby
      │
      ▼
Inspect / Verify
      │
      ▼
Prepare Metadata
      │
      ▼
Organize Collections
      │
      ▼
Validate Project
      │
      ▼
Publish Project
      │
      ▼
Track Publication
      │
      ▼
Portfolio / Explorer
```

This represents the overall direction of the platform. Individual projects do not have to use every module.

---

## Security Boundary

The most important security boundary is between browser-accessible code and server-only code.

```text
BROWSER / PUBLIC
│
├── UI
├── Client state
├── Wallet interaction
├── Public configuration
└── Supported direct browser operations
              │
              │
       SERVER BOUNDARY
              │
              ▼
SERVER / PRIVATE
│
├── Protected API credentials
├── Server-side Shelby operations
├── Server-side preparation
└── Server-only application logic
```

This boundary is a core part of the application's security model.

---

## Current Architectural Characteristics

The current implementation can be summarized as follows:

- **Single Application** — Frontend pages and server-side API routes are contained within one Next.js project.
- **Project-Centric** — Projects connect storage, assets, metadata, collections, activity, and publication.
- **Wallet-Aware** — Wallet state influences authorization and wallet-specific workspace access.
- **Hybrid Storage** — Storage can use server-assisted and browser-direct workflows.
- **Server-Side Secrets** — Protected Shelby credentials remain on the server.
- **Modular Features** — Major application areas are separated into feature-specific components and libraries.
- **Derived Publication State** — Publication presentation is derived from project and publication information.
- **Lightweight Infrastructure** — The application does not currently require a separate persistent backend service.

---

## Current Limitations

The current architecture remains intentionally lightweight.

It does not yet provide a complete infrastructure layer for:

- Persistent multi-device project storage
- Global asset indexing
- Real-time collaboration
- Organization-level access control
- Large-scale analytics
- Background indexing workers
- Complete audit history
- Advanced recovery infrastructure

These are future architectural requirements rather than assumptions about the current system.

---

## Planned Architecture

If future requirements justify additional infrastructure, the architecture can evolve without replacing the current application model.

A possible future structure is:

```text
                         Shelby Studio
                              │
              ┌───────────────┴───────────────┐
              │                               │
           Frontend                        Backend
              │                               │
              │                    ┌──────────┼──────────┐
              │                    │          │          │
              │                   API      Database    Worker
              │                    │          │          │
              └────────────────────┴──────────┴──────────┘
                                           │
                                   Indexing / Sync
                                           │
                                           ▼
                                    Shelby / Aptos
```

Potential future infrastructure includes:

- Database-backed project persistence
- Global Shelby asset indexing
- Background workers
- Cross-device synchronization
- Team workspaces
- Permissions
- Analytics
- Audit history
- Project versioning
- Recovery workflows

These additions should only be introduced when the product requirements justify their complexity.

---

## Architectural Principles

The architecture follows several principles:

**Separate Responsibilities**
UI, state, domain logic, services, API routes, and external integrations should have clear responsibilities.

**Protect Secrets**
Private credentials and signing material must remain server-side.

**Keep Wallet Operations User-Controlled**
Transactions requiring user authority should involve the connected wallet.

**Prefer Derived State**
Important status indicators should be based on actual project, storage, and transaction information.

**Avoid Unnecessary Infrastructure**
A separate backend service should only be introduced when the current Next.js architecture can no longer reasonably support the required workload.

**Design for Extension**
The current project, storage, and publication systems should provide foundations for future persistence, indexing, collaboration, and analytics.

---

## Summary

Shelby Studio uses a hybrid Next.js architecture that combines a browser-based developer workspace, wallet integration, server-side API routes, application services, Shelby integration, and Aptos network interaction.

The architecture is centered around projects. Projects connect assets, storage, metadata, collections, publication information, and presentation layers into a unified workspace model.

The current system intentionally keeps infrastructure lightweight while maintaining a clear boundary between browser operations and protected server operations.

As Shelby Studio grows, persistent storage, indexing, synchronization, collaboration, analytics, and background services can be added without abandoning the existing project-centric architecture.