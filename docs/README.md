# Shelby Studio Documentation

Shelby Studio is a project-centric developer workspace for building, organizing, storing, publishing, and exploring digital assets on the Shelby network.

This documentation describes how the platform is structured, how its major systems work, which capabilities are currently implemented, and which capabilities are planned for future development.

The documentation is intentionally aligned with the current codebase. Features that are still being developed are identified as planned rather than being presented as completed functionality.

---

## Documentation Structure

```text
docs/

├── README.md
│
├── Getting Started
│   ├── introduction.md
│   ├── philosophy.md
│   └── architecture.md
│
├── Storage
│   ├── storage-engine.md
│   ├── upload-pipeline.md
│   └── explorer.md
│
├── NFT Development
│   ├── metadata.md
│   ├── collections.md
│   └── dashboard.md
│
└── Engineering
    └── engineering-decisions.md
```

---

## Getting Started

These documents explain the purpose and overall architecture of Shelby Studio.

### Introduction — `introduction.md`

Explains:

- What Shelby Studio is
- The problem it is designed to solve
- The platform vision
- Current capabilities
- Planned development
- Target users
- Project goals

### Philosophy — `philosophy.md`

Explains the principles that guide the platform, including:

- Developer-first design
- Transparency
- Modularity
- Reliability
- Wallet-controlled operations
- Scalability
- Verification over assumptions

### Architecture — `architecture.md`

Explains:

- The Next.js application architecture
- Frontend and backend responsibilities
- Wallet integration
- Project architecture
- Storage architecture
- Publication architecture
- Shelby integration
- API routes
- Security boundaries
- Current limitations
- Future infrastructure

---

## Storage

The Storage documentation explains how Shelby Studio interacts with decentralized storage.

### Storage Engine — `storage-engine.md`

Covers:

- Storage responsibilities
- Asset representation
- Shelby integration
- Storage records
- Downloads
- Object information
- Storage state
- Current limitations
- Future storage capabilities

### Upload Pipeline — `upload-pipeline.md`

Documents the upload lifecycle, including:

- File selection
- Validation
- Upload preparation
- Shelby commitments
- Browser-direct uploads
- Server-assisted operations
- Wallet authorization
- Upload progress
- Finalization
- Result handling

### Explorer — `explorer.md`

Documents the asset exploration interface, including:

- Asset browsing
- Search
- Filtering
- Sorting
- Asset inspection
- Wallet-aware access
- Empty states
- Published project views
- Planned indexing and global exploration

---

## Projects

Projects are the central organizational model of Shelby Studio.

Project functionality is currently implemented through:

```text
/projects
/projects/[id]
```

The project system provides a workspace for organizing related assets, metadata, collections, storage information, activity, and publication information.

Project documentation is covered across the Architecture, Dashboard, Storage, and Engineering documents.

The project system currently includes:

- Project creation
- Project listing
- Project selection
- Project-specific dashboards
- Wallet-aware project access
- Project assets
- Project metadata state
- Storage information
- Publication information
- Project validation
- Project import and export utilities

---

## Publication

Publication is a project-level workflow that connects a project with its completed storage and publication information.

The publication system includes:

- Publication validation
- Publish checklist
- Publish summary
- Wallet-controlled transaction flow
- Publication success state
- Publication records
- Registration transaction information
- Commit transaction information
- Storage URI information
- Explorer URL information
- Publication status
- Publication completion state
- Publication timeline information

Publication information is represented throughout the project dashboard and portfolio systems.

The publication system is documented primarily in:

- `architecture.md`
- `engineering-decisions.md`
- Project and publication implementation within the source code

---

## NFT Development

Shelby Studio contains tooling for preparing assets for NFT-oriented workflows.

### Metadata — `metadata.md`

Documents:

- NFT information
- Image handling
- Attributes
- Metadata templates
- Metadata validation
- JSON generation
- JSON preview
- Metadata import
- Metadata actions

### Collections — `collections.md`

Documents:

- Collection organization
- Collection information
- Collection assets
- Collection metadata
- Collection branding
- Collection previews
- Collection actions
- Project integration

### Dashboard — `dashboard.md`

Documents the central workspace experience and how projects, storage, assets, activity, and related information are presented.

---

## Explorer

The Explorer provides a workspace-oriented interface for browsing stored assets.

Current Explorer functionality includes:

- Wallet-aware access
- Asset search
- Status filtering
- Sorting
- Asset table display
- Asset rows
- Empty states
- Published project views

Current sorting options include:

- Newest
- Oldest
- Name A-Z
- Largest
- Smallest

The Explorer is currently centered around the connected workspace. A future version may introduce persistent global indexing so that Explorer can become a broader network-level discovery system.

---

## Portfolio

Portfolio provides a presentation layer for published projects and related assets.

The current implementation includes:

- Portfolio header
- Portfolio statistics
- Published project cards
- Published project grids
- Project details
- Empty portfolio states
- NFT-oriented views

Portfolio is connected to the project and publication systems.

Future development may expand Portfolio into a more complete public presentation and project discovery layer.

---

## Developer

The Developer area provides a foundation for developer-oriented Shelby tooling.

Current components include:

- API Playground
- Code Generator
- SDK Explorer
- Examples
- Developer Header

The Developer area is intended to become a more comprehensive environment for developers who want to work with Shelby APIs, SDK functionality, and application integrations.

---

## AI

The AI area provides the foundation for future AI-assisted development workflows.

Current interface components include:

- AI Header
- AI Chat
- AI History
- AI Prompts

The AI system is currently treated as a separate application module and does not form a dependency for the core storage or project workflows.

Future development may introduce more advanced AI-assisted project, metadata, storage, and developer workflows.

---

## Engineering

The Engineering documentation explains the technical decisions behind Shelby Studio.

### Engineering Decisions — `engineering-decisions.md`

Covers:

- Frontend/backend boundaries
- Wallet-controlled transactions
- Server-side credential protection
- Browser-direct uploads
- Project-centric architecture
- Derived publication state
- Local state and synchronization
- API route responsibilities
- Scalability considerations
- Future infrastructure

---

## Current Implementation

The current Shelby Studio codebase provides a working foundation across several major areas.

**Application**
- Next.js App Router
- React-based interface
- TypeScript
- Tailwind CSS
- Feature-oriented component architecture

**Wallet**
- Aptos wallet integration
- Wallet connection state
- Wallet address handling
- Wallet-authorized transaction flows

**Storage**
- Shelby integration
- File uploads
- Browser-direct upload support
- Streaming upload support
- Upload preparation
- Upload finalization
- Download support
- Storage information
- Asset records

**Projects**
- Project creation
- Project listing
- Project selection
- Project-specific routes
- Project dashboard
- Wallet-aware project state
- Project validation
- Project import/export utilities

**Publication**
- Project publication workflow
- Publication validation
- Publish checklist
- Publish summary
- Wallet transaction authorization
- Publication success state
- Publication records
- Publication status
- Publication-derived project views

**Explorer**
- Asset browsing
- Search
- Status filtering
- Sorting
- Asset inspection
- Wallet-aware empty states
- Published project presentation

**Portfolio**
- Published project presentation
- Portfolio statistics
- Project cards
- Project grids
- Project details
- Empty states

**Metadata**
- NFT metadata creation
- Attributes
- Image handling
- Templates
- Validation
- JSON preview
- Import/export-related workflows

**Collections**
- Collection organization
- Collection assets
- Collection metadata
- Collection branding
- Collection preview
- Collection actions

**Developer**
- API Playground foundation
- Code generation foundation
- SDK exploration
- Examples

**AI**
- AI interface foundation
- Chat interface
- Prompt interface
- History interface

---

## Architecture Model

Shelby Studio is currently deployed as a single Next.js application.

The application contains both browser-facing functionality and server-side API routes.

```text
Shelby Studio
│
├── Browser
│   ├── UI
│   ├── Wallet
│   ├── Project State
│   ├── Metadata State
│   └── Browser-Direct Operations
│
├── Next.js Server
│   ├── API Routes
│   ├── Protected Credentials
│   └── Server-Side Shelby Operations
│
└── External Infrastructure
    ├── Shelby
    └── Aptos
```

A separate backend service is not currently required for the core application.

Future infrastructure may introduce databases, indexing services, workers, or additional backend services if the product requires them.

---

## Security Model

Sensitive credentials must remain server-side.

The current application uses server-only environment variables for protected Shelby operations. Examples include:

- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

These values must never be committed to the repository.

Browser-visible configuration uses the `NEXT_PUBLIC_` convention and must therefore be treated as public.

Wallet private keys and seed phrases must never be stored by Shelby Studio.

---

## Current Limitations

The current platform is still under active development.

The application does not yet provide a complete centralized backend for:

- Multi-device persistent project synchronization
- Global asset indexing
- Large-scale analytics
- Real-time collaboration
- Organization-level permissions
- Background indexing workers
- Full audit history
- Advanced recovery infrastructure

These limitations are part of the current architecture and inform the future roadmap.

---

## Planned Development

The long-term roadmap includes:

**Storage**
- Additional storage management operations
- Object deletion workflows
- Replacement workflows
- Improved recovery
- Advanced storage inspection

**Explorer**
- Broader asset discovery
- Persistent indexing
- Advanced search
- Batch operations
- Version history

**Projects**
- Persistent multi-device workspaces
- Improved project synchronization
- Project version history
- Recovery workflows
- Collaboration

**Publication**
- More comprehensive publication lifecycle tracking
- Improved publication verification
- Expanded project publishing workflows

**Portfolio**
- Public project discovery
- Richer project presentation
- Improved asset presentation
- Portfolio sharing

**NFT Development**
- Advanced metadata workflows
- Collection builder improvements
- Mint-ready exports
- NFT deployment tooling

**Developer Tools**
- Expanded API tooling
- SDK utilities
- Code generation
- Integration examples
- Developer automation

**AI**
- AI-assisted metadata generation
- Project assistance
- Storage workflow assistance
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

## Documentation Philosophy

The documentation follows one important rule:

> The documentation should describe the actual system, not an imagined future version of the system.

For that reason, features should be classified as either:

- **Current** — Functionality implemented in the current codebase.
- **Planned** — Functionality intended for future development but not yet considered complete.

This distinction should be maintained as Shelby Studio evolves.

---

## Updating the Documentation

When a major feature is added or changed, the documentation should be updated alongside the implementation.

Changes that may require documentation updates include:

- New application modules
- New API routes
- New storage workflows
- Changes to wallet architecture
- Changes to project state
- Publication workflow changes
- New security boundaries
- New infrastructure
- New public-facing capabilities

Documentation should remain synchronized with the actual codebase.

---

## Related Documentation

- [Introduction](./introduction.md)
- [Philosophy](./philosophy.md)
- [Architecture](./architecture.md)
- [Storage Engine](./storage-engine.md)
- [Upload Pipeline](./upload-pipeline.md)
- [Explorer](./explorer.md)
- [Metadata](./metadata.md)
- [Collections](./collections.md)
- [Dashboard](./dashboard.md)
- [Engineering Decisions](./engineering-decisions.md)