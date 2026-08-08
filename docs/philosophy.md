# Philosophy

Shelby Studio is built around a simple idea:

> Developers should spend more time building applications and less time managing fragmented storage workflows.

Shelby provides decentralized storage infrastructure. Shelby Studio builds a developer experience around that infrastructure, making storage, projects, assets, publication, and related development workflows easier to manage from one workspace.

The platform does not aim to hide the underlying Shelby infrastructure. Instead, it provides a structured interface that makes important operations understandable, traceable, and easier to use.

---

## Developer First

Shelby Studio is designed around the developer's workflow.

A developer should be able to move through a project without constantly switching between unrelated tools for:

- Project organization
- Asset management
- Decentralized storage
- Metadata preparation
- Collection management
- Publication
- Asset inspection
- Developer tooling

The interface should reduce unnecessary complexity while still exposing information that matters.

---

## Project-Centric Design

Projects are the central organizational concept in Shelby Studio.

A project connects the different parts of an application's workflow:

```text
Project
│
├── Assets
├── Storage
├── Metadata
├── Collections
├── Activity
└── Publication
```

This allows project information to remain connected as the application moves from development to storage and eventually publication.

The project model is also intended to provide a foundation for future persistence, synchronization, collaboration, and analytics.

---

## Transparency

Decentralized infrastructure should not become a black box.

Shelby Studio therefore emphasizes visibility into important operations.

Developers should be able to understand:

- What operation is being performed
- Which project is involved
- Which wallet is connected
- Where an asset is stored
- Whether an operation succeeded
- What transaction information is available
- What publication state the project is currently in

The application should avoid presenting an operation as complete when the underlying state does not support that conclusion.

---

## Verification Over Assumption

Important application states should be derived from actual information whenever possible.

For example, a project should not simply be treated as successfully published because a publish action was initiated.

Publication state can depend on information such as:

- Publication records
- Registration information
- Commit information
- Transaction information
- Storage information
- Network information

This principle extends to storage and asset workflows as well.

The interface should reflect the state of the underlying operation rather than merely the state of the UI.

---

## User-Controlled Blockchain Operations

Shelby Studio uses the connected Aptos wallet for operations that require user authorization.

The application should not silently take control of a user's wallet.

Wallet interaction is therefore treated as both:

- An authorization mechanism
- An important part of the workspace identity model

When a blockchain transaction requires the user's authority, the user should be able to review and approve that transaction through the connected wallet.

---

## Security by Boundary

Shelby Studio uses a hybrid browser/server architecture.

This creates a clear distinction between:

**Browser**

The browser handles:

- User interface
- Client state
- Wallet interaction
- Supported browser-direct operations
- Public configuration

**Server**

The server handles:

- Protected API routes
- Server-side Shelby operations
- Protected credentials
- Operations that should not expose sensitive configuration

Sensitive credentials such as server-side Shelby API credentials and signing material must remain behind this boundary.

---

## Modularity

Shelby Studio is organized into independent feature areas.

Current application areas include:

- Dashboard
- Storage
- Explorer
- Projects
- Portfolio
- Metadata
- Collections
- Developer
- AI
- Profile
- Documentation

The implementation also separates responsibilities across:

- Components
- Contexts
- Domain libraries
- Service layers
- API routes
- Shelby integration modules

This allows individual systems to evolve without forcing the entire application into a single implementation.

---

## Reliability

Storage and publication workflows should prioritize correctness.

The application should avoid creating a false sense of success simply because a request was sent.

Instead, important workflows should account for the state of the operation and provide appropriate feedback.

This includes:

- Upload preparation
- Upload progress
- Upload completion
- Object inspection
- Publication preparation
- Publication completion
- Transaction information

Reliability is therefore treated as part of the product experience rather than merely an infrastructure concern.

---

## Lightweight Infrastructure

Shelby Studio currently uses a single Next.js application.

The project does not require a separate backend service simply because it has server-side functionality.

Next.js provides:

- Browser-facing application pages
- Server-rendered functionality where required
- API routes
- Server-side service execution

Additional infrastructure should only be introduced when the product requirements justify it.

Potential future infrastructure may include:

- Databases
- Indexing services
- Background workers
- Persistent synchronization
- Collaboration services

These should be introduced based on actual requirements rather than architectural assumptions.

---

## Direct Browser Storage

Large storage operations can benefit from direct browser-to-Shelby workflows.

Where supported, Shelby Studio can generate commitments and prepare an operation while allowing large file data to move directly from the browser toward Shelby rather than unnecessarily passing the entire payload through the application server.

This approach can provide:

- Reduced server bandwidth usage
- Better handling of large files
- Clearer separation between preparation and data transfer
- Direct wallet-controlled transaction flows where required

The server can still participate in preparation and finalization steps where necessary.

---

## Progressive Architecture

Shelby Studio is intentionally being developed incrementally.

The current system establishes foundations for:

- Projects
- Storage
- Asset exploration
- Publication
- Metadata
- Collections
- Portfolio presentation
- Developer tooling

Future infrastructure should build on these foundations rather than replacing them unnecessarily.

This means the architecture is designed to support growth while allowing the current application to remain relatively lightweight.

---

## Practical Over Theoretical

Shelby Studio is intended to solve practical developer problems.

Features should be evaluated based on whether they improve real workflows.

A technically sophisticated feature is not automatically useful if it makes the application harder to understand or maintain.

The preferred approach is:

```text
Identify the workflow
        │
        ▼
Understand the underlying Shelby operation
        │
        ▼
Design the simplest useful interface
        │
        ▼
Keep important information visible
        │
        ▼
Verify the resulting state
```

---

## Future-Oriented Design

The current implementation should not be confused with the complete long-term vision.

Several areas are expected to expand over time. These include:

- Persistent project storage
- Cross-device synchronization
- Broader asset indexing
- Project version history
- Recovery workflows
- Collaboration
- Permissions
- Analytics
- Richer portfolio functionality
- Expanded developer tools
- AI-assisted workflows

These features are planned directions rather than assumptions about the current implementation.

---

## Engineering Values

The development of Shelby Studio follows several practical values:

- Keep the developer experience clear.
- Keep important operations transparent.
- Prefer verified state over assumptions.
- Keep wallet-controlled actions under user control.
- Protect server-side credentials.
- Separate responsibilities between application layers.
- Avoid unnecessary infrastructure.
- Design current systems so they can be extended later.
- Keep project information organized around a consistent project model.
- Document important architectural decisions.

---

## Current Direction

The current direction of Shelby Studio is centered on turning the existing storage foundation into a broader project workspace.

The platform is moving toward a workflow where developers can:

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
Store on Shelby
      │
      ▼
Inspect and Verify
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
Publish
      │
      ▼
Present Through Portfolio / Explorer
```

This workflow represents the direction of the platform rather than requiring every project to follow every step.

---

## Summary

Shelby Studio is guided by a philosophy of simplicity, transparency, user control, modularity, and verified state.

The platform combines a project-centric workspace with Shelby storage, wallet interaction, publication workflows, asset exploration, metadata preparation, collections, portfolio presentation, and developer tooling.

The architecture remains intentionally lightweight while preserving clear boundaries between the browser, server, wallet, project state, and Shelby infrastructure.

As the platform grows, new infrastructure and capabilities should be introduced only where they provide meaningful value to developers and users.