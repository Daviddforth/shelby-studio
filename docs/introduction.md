# Introduction

Shelby Studio is a project-centric developer workspace for building, organizing, storing, publishing, and exploring digital assets on the Shelby network.

The platform brings storage workflows, wallet interaction, project organization, publication, asset exploration, metadata preparation, collections, developer tooling, and future AI-assisted workflows into a single application.

Shelby Studio is being developed as a modular platform. Each major capability is separated into its own application area while sharing common project, wallet, storage, and infrastructure layers.

---

## Overview

Building applications around decentralized storage can require developers to manage several separate workflows.

A typical application may need to:

- Manage a connected wallet
- Organize application assets
- Upload files to decentralized storage
- Track storage information
- Verify storage operations
- Prepare metadata
- Organize collections
- Manage project state
- Prepare a project for publication
- Track publication information
- Present published projects and assets

Shelby Studio brings these workflows into a project-oriented workspace.

The project is not intended to replace the Shelby network or hide its underlying capabilities. Instead, it provides an application layer that makes those capabilities easier to work with while keeping important operations visible to developers.

---

## The Problem

Decentralized application development often involves moving between different tools and interfaces.

Storage may be handled in one place, metadata in another, project organization somewhere else, and deployment or publication through separate workflows.

This can create several problems:

- Repeated manual work
- Fragmented project information
- Difficult-to-track storage operations
- Limited visibility into publication state
- Inconsistent asset organization
- Increased implementation complexity

Shelby Studio approaches this problem by providing a unified workspace around the project.

---

## The Shelby Studio Approach

The central concept of Shelby Studio is the **project**.

A project provides an organizational boundary for related application information.

A simplified project can contain:

```text
Project
│
├── Identity
├── Assets
├── Storage
├── Metadata
├── Collections
├── Activity
└── Publication
```

This allows different parts of the platform to work together without requiring every feature to maintain its own independent representation of the same project.

For example:

1. A developer creates a project.
2. Assets are added to the project.
3. Assets are uploaded to Shelby.
4. Storage information is recorded.
5. The project can be inspected through Explorer.
6. Metadata and collections can be prepared.
7. The project can be validated for publication.
8. Publication information is associated with the project.
9. Published project information can be presented through Portfolio and Explorer.

Not every project must use every module.

---

## Vision

The long-term vision for Shelby Studio is to provide a complete development workspace for builders working with Shelby.

The platform is intended to evolve from its current storage and project foundation into a broader environment where developers can manage the lifecycle of decentralized application assets from one workspace.

The long-term direction includes:

- Project management
- Decentralized storage
- Asset exploration
- Metadata preparation
- Collection management
- Project publication
- Portfolio presentation
- Developer tooling
- AI-assisted workflows
- Persistent project infrastructure
- Collaboration

The objective is to make Shelby development more approachable without removing the transparency and control that decentralized infrastructure provides.

---

## Core Concept: Project-Centric Development

Projects are the primary organizational unit in Shelby Studio.

Instead of treating storage objects, metadata, collections, and publication information as unrelated features, the platform connects them through the project model.

This allows the application to present information in context.

For example, a project dashboard can bring together:

- Project identity
- Asset counts
- Storage information
- Recent activity
- Publication state
- Project readiness
- Quick actions
- Published project information

This project-centric approach also provides a foundation for future persistence, synchronization, collaboration, and analytics.

---

## Wallet-Aware Workspace

Shelby Studio uses the connected Aptos wallet as an important part of the application model.

The wallet is responsible for user-controlled blockchain operations and provides the application with the identity required for wallet-specific workflows.

Wallet functionality includes:

- Connecting a wallet
- Detecting wallet connection state
- Reading the connected address
- Requesting transaction signatures
- Submitting wallet-authorized transactions

Wallet state also influences access to workspace information.

The application should not continue presenting wallet-specific project information after the wallet context required for that information is no longer available.

---

## Storage

Storage is one of the core capabilities of Shelby Studio.

The application integrates with Shelby to provide storage workflows such as:

- Uploading assets
- Preparing uploads
- Streaming uploads
- Browser-direct uploads
- Finalizing uploads
- Downloading assets
- Querying storage information
- Inspecting stored objects

The platform supports a hybrid storage architecture.

Some operations can be assisted by the Next.js server, while supported large-file workflows can transfer data directly from the browser to Shelby. This avoids unnecessarily routing large file payloads through the application server.

---

## Asset Explorer

Explorer provides a workspace-oriented interface for browsing assets.

The current Explorer experience includes:

- Asset search
- Status filtering
- Sorting
- Asset rows
- Asset tables
- Empty states
- Wallet-aware workspace handling
- Published project presentation

The current Explorer is primarily connected to the application's workspace and project model.

A broader indexing system is planned for future development.

---

## Projects

The Projects area provides the central workspace for organizing application development.

Current project functionality includes:

- Creating projects
- Listing projects
- Selecting projects
- Opening project dashboards
- Viewing project-specific information
- Managing project state
- Validating projects
- Importing and exporting project information
- Tracking publication information

Individual projects are accessible through dynamic routes:

```text
/projects
/projects/[id]
```

The project dashboard acts as the central point where project assets, storage, activity, readiness, and publication information can be brought together.

---

## Publication

Publication is a project-level workflow.

Rather than treating publication as a simple completed/not-completed flag, Shelby Studio tracks publication information as a collection of related state.

Publication information can include:

- Project owner
- Network
- Manifest information
- Registration transaction
- Commit transaction
- Transaction hash
- Storage URI
- Explorer URL
- Publication status

The publication system also provides validation and completion logic so that the interface can distinguish between incomplete and completed publication states.

The publication workflow is integrated with the project dashboard and presentation layers.

---

## Portfolio

Portfolio provides a presentation layer for published project information.

The current implementation includes:

- Portfolio headers
- Portfolio statistics
- Published project cards
- Published project grids
- Project details
- Empty states
- NFT-oriented views

Portfolio is connected to the project and publication systems.

The long-term direction is to make Portfolio a stronger public presentation and discovery layer for projects built with Shelby Studio.

---

## Metadata

Shelby Studio includes tooling for preparing NFT-oriented metadata.

Current metadata functionality includes:

- NFT information
- Image handling
- Attribute management
- Metadata templates
- Metadata validation
- JSON generation
- JSON preview
- Metadata import
- Metadata actions

Metadata is designed to operate within the wider project and collection workflow.

The goal is to allow developers to prepare structured asset information without leaving the project workspace.

---

## Collections

Collections provide a way to organize related project assets.

The current collection system includes areas for:

- Collection information
- Collection assets
- Collection metadata
- Collection branding
- Collection preview
- Collection actions
- Active project context

Collections form part of the NFT-oriented development layer of Shelby Studio.

Future versions may expand collections into more advanced asset organization and deployment workflows.

---

## Developer Tools

The Developer area provides a foundation for tools intended for Shelby developers.

Current components include:

- API Playground
- Code Generator
- SDK Explorer
- Examples

The purpose of this area is to make Shelby-related development workflows more accessible from within the same environment used to manage projects and assets.

Future development may introduce additional API utilities, SDK tooling, integration examples, and automation.

---

## AI

Shelby Studio includes an AI application area intended for future AI-assisted development workflows.

The current interface contains:

- AI Chat
- AI History
- AI Prompts
- AI Header

The AI layer is intentionally separate from the core storage and project infrastructure. This allows AI functionality to evolve independently without becoming a dependency for the fundamental application workflows.

Potential future applications include:

- Metadata assistance
- Project analysis
- Storage assistance
- Developer guidance
- Workflow automation

---

## Current Implementation

The current application provides a foundation across the following areas.

**Core Application**
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Feature-oriented component structure

**Wallet**
- Aptos wallet integration
- Wallet connection
- Wallet state
- Wallet address handling
- User-authorized transactions

**Storage**
- Shelby integration
- Upload preparation
- Upload finalization
- Browser-direct upload support
- Streaming upload support
- Download support
- Storage information
- Asset records

**Projects**
- Project creation
- Project listing
- Project selection
- Project dashboards
- Wallet-aware project state
- Project validation
- Project import/export utilities

**Publication**
- Publication validation
- Publish checklist
- Publish summary
- Wallet-authorized publication operations
- Publication success state
- Publication records
- Publication status
- Publication-derived project views

**Explorer**
- Asset browsing
- Search
- Filtering
- Sorting
- Asset inspection
- Empty states
- Published project views

**Portfolio**
- Published project presentation
- Project cards
- Project grids
- Portfolio statistics
- Project details

**Metadata**
- Metadata creation
- Attributes
- Image handling
- Templates
- Validation
- JSON preview
- Import workflows

**Collections**
- Collection information
- Collection assets
- Collection metadata
- Collection branding
- Collection preview
- Collection actions

**Developer**
- API Playground foundation
- SDK Explorer
- Code Generator
- Examples

**AI**
- AI interface foundation
- Chat interface
- Prompt interface
- History interface

---

## Current Architecture

Shelby Studio currently uses a single Next.js application.

The application contains both browser-facing functionality and server-side API routes.

```text
Shelby Studio
│
├── Browser
│   ├── Application UI
│   ├── Wallet
│   ├── Client State
│   ├── Project State
│   └── Browser-Direct Storage
│
├── Next.js Server
│   ├── API Routes
│   ├── Server-Side Services
│   └── Protected Credentials
│
└── External Infrastructure
    ├── Shelby
    └── Aptos
```

A separate frontend and backend deployment is not currently required.

The architecture can evolve later if persistent databases, indexing services, background workers, or collaboration infrastructure become necessary.

---

## Security Model

The application separates browser-accessible functionality from protected server functionality.

Server-only credentials include values such as:

- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

These credentials must remain outside the browser and must never be committed to the repository.

Browser-visible configuration uses the `NEXT_PUBLIC_` convention and should therefore be treated as public.

Wallet private keys and seed phrases are not application configuration and must never be stored by Shelby Studio.

---

## Development Philosophy

Shelby Studio follows several principles.

**Build Around the Developer**
The platform should reduce unnecessary complexity without hiding important information.

**Prefer Verification**
Important state should be derived from actual storage, transaction, and publication information rather than assumptions.

**Keep Responsibilities Separate**
UI components, state management, domain logic, infrastructure services, and server operations should have clear boundaries.

**Keep Users in Control**
Blockchain operations that require user authority should involve the user's connected wallet.

**Protect Sensitive Operations**
Server-only credentials and protected operations must remain behind the server boundary.

**Avoid Unnecessary Infrastructure**
Additional backend services should only be introduced when the application's requirements justify them.

---

## Target Users

Shelby Studio is primarily designed for developers and builders working with Shelby.

Potential users include:

- Web3 developers
- Decentralized application developers
- NFT creators
- Digital asset developers
- Storage application developers
- Open-source contributors
- Developers experimenting with Shelby infrastructure

The platform is intended to support both developers who are new to Shelby and developers who need a more structured workspace for larger projects.

---

## Current Limitations

Shelby Studio remains in active development.

The current system does not yet provide a complete infrastructure layer for:

- Persistent multi-device project storage
- Global asset indexing
- Real-time collaboration
- Organization-level permissions
- Large-scale analytics
- Background indexing workers
- Complete audit history
- Advanced recovery infrastructure

These are future architectural concerns rather than requirements of the current application.

---

## Planned Development

Future development is expected to expand the platform in several directions.

**Storage**
- Additional object management operations
- Improved replacement workflows
- Recovery workflows
- Advanced storage inspection

**Explorer**
- Broader asset discovery
- Persistent indexing
- Advanced search
- Batch operations
- Version history

**Projects**
- Persistent multi-device workspaces
- Improved synchronization
- Project version history
- Recovery
- Collaboration

**Publication**
- Expanded publication lifecycle tracking
- Stronger publication verification
- Improved publishing workflows

**Portfolio**
- Public project discovery
- Improved project presentation
- Richer asset presentation
- Portfolio sharing

**NFT Development**
- Advanced metadata workflows
- Collection builder improvements
- Mint-ready exports
- Additional NFT tooling

**Developer Tools**
- Expanded API tooling
- SDK utilities
- Code generation
- Integration examples
- Developer automation

**AI**
- AI-assisted metadata
- Project assistance
- Storage assistance
- Developer assistance
- Intelligent project analysis

**Infrastructure**
- Persistent database-backed state
- Global asset indexing
- Background workers
- Cross-device synchronization
- Team workspaces
- Permissions and roles
- Analytics
- Audit history

---

## Project Goals

The primary goals of Shelby Studio are to:

- Simplify Shelby development workflows
- Provide a unified project workspace
- Improve developer productivity
- Make decentralized storage easier to work with
- Keep important storage and publication operations transparent
- Encourage practical adoption of Shelby
- Provide reusable developer tooling
- Create a foundation for future ecosystem applications

---

## Summary

Shelby Studio is being developed as more than a storage interface.

It is a project-centric developer workspace that connects decentralized storage, project organization, publication, asset exploration, metadata preparation, collections, developer tooling, and future AI-assisted workflows.

The current architecture intentionally remains lightweight while providing clear boundaries between the browser, server, wallet, project state, storage services, and Shelby infrastructure.

As development continues, the platform can expand toward persistent infrastructure, indexing, collaboration, analytics, richer publication workflows, and additional developer tooling without abandoning its project-centric foundation.