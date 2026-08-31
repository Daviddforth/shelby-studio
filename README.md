# Shelby Studio

A project-centric developer workspace for building, organizing, storing, publishing, and exploring applications and digital assets on the Shelby network.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Aptos](https://img.shields.io/badge/Aptos-Compatible-5A45FF)](https://aptos.dev/)
[![Shelby](https://img.shields.io/badge/Shelby-Storage-111827)](https://shelby.xyz/)

## What is Shelby Studio?

Shelby Studio is a developer workspace built around the Shelby storage ecosystem.

It brings together the workflows developers need when building applications around decentralized storage and digital assets.

Instead of switching between separate tools for storage, assets, NFT metadata, collections, publishing, and exploration, Shelby Studio provides these workflows inside one connected project workspace.

The platform follows a project-centric model where developers can connect an Aptos-compatible wallet, create projects, manage assets and metadata, prepare collections, and move projects through a publishing workflow.

Shelby Studio is an independent developer project built around the Shelby ecosystem.

---

## Core Workflow

Shelby Studio is organized around a project-centric workflow:

```text
                         Shelby Studio Project
                                  |
                    +-------------+-------------+
                    |                           |
                    v                           v
                 Storage                     Metadata
                    |                           |
                    v                           v
                  Assets                    NFT Data
                    |                           |
                    +-------------+-------------+
                                  |
                                  v
                              Collections
                                  |
                                  v
                         Publish Readiness
                                  |
                                  v
                           Publish Project
                                  |
                                  v
                          Published Project
                             /         \
                            v           v
                        Portfolio     Explorer
```

The goal is to keep the complete development workflow connected instead of requiring developers to coordinate each stage across separate tools.

## Platform

Shelby Studio is organized into connected modules for managing projects, assets, storage, metadata, collections, publishing, and development.

| Module | Purpose | Status |
|---|---|---|
| Dashboard | Central workspace for projects, storage, assets, and activity | Implemented |
| Projects | Create and manage wallet-specific project workspaces | Implemented |
| Storage | Upload, store, inspect, and download digital assets | Implemented |
| Assets | Manage and organize project files | Implemented |
| Explorer | Search, filter, sort, and inspect workspace assets | Implemented |
| Metadata | Create, edit, validate, and export NFT metadata | Implemented |
| Collections | Organize assets and configure NFT collections | Implemented |
| Publishing | Prepare projects for publication through the project workflow | Implemented |
| Portfolio | Display published projects and project information | Implemented |
| Developer | Developer utilities, API exploration, SDK information, and examples | Implemented |
| AI | Intelligent development assistance | In development |

## Features

### Dashboard

The central workspace for monitoring project activity and storage.

The dashboard provides:

- Project overview
- Storage statistics
- Quick actions
- Network status
- Storage overview
- Storage analytics

### Projects

Create and manage project-specific workspaces.

Projects provide the organizational layer connecting assets, metadata, collections, storage, and publishing.

### Storage

Manage digital assets through Shelby-backed storage workflows.

The Storage Manager provides a workspace for:

- Uploading assets
- Viewing storage information
- Inspecting stored files
- Downloading assets
- Monitoring storage usage

### Asset Management

Manage digital files used throughout a project.

Assets can be organized and inspected before being used by metadata, collections, or publishing workflows.

### Metadata

Create and manage NFT metadata directly inside Shelby Studio.

The metadata workspace includes:

- NFT information
- Attribute management
- Metadata templates
- Metadata import
- NFT preview
- JSON preview
- Metadata validation
- Metadata export

### Collections

Organize project assets and metadata into NFT collections.

The Collection Builder provides tools for:

- Collection information
- Collection branding
- Collection preview
- Collection actions
- Asset organization

### Explorer

Explore and inspect assets and project data through a dedicated workspace.

The Explorer is designed to provide visibility into the assets and information associated with a project.

### Publishing

Prepare projects for publication through a structured project workflow.

Publishing connects project assets, metadata, collections, and storage into a single preparation process.

### Portfolio

Display published projects and associated project information.

### Developer Tools

A dedicated developer surface for working with Shelby-related development resources.

Planned and supported areas include:

- API exploration
- SDK information
- Developer utilities
- Examples
- API Playground

### AI

AI-powered development assistance is part of the longer-term Shelby Studio roadmap.

Status: In development

## Wallet & Demo Mode

Shelby Studio supports both wallet-connected workflows and demonstration workspaces.

### Wallet-connected mode

When an Aptos-compatible wallet is connected, Shelby Studio can provide access to wallet-specific project workflows.

These workflows are designed around the connected wallet and its associated project environment.

### Demo mode

Users can explore selected Shelby Studio workflows without immediately connecting a wallet.

Demo workspaces currently provide sample experiences for areas such as:

- Storage
- Metadata
- Collections

Demo data is separated from wallet-connected project data.

The general experience is:

```text
                  Shelby Studio
                       |
             +---------+---------+
             |                   |
             v                   v
        Demo Workspace      Connect Wallet
             |                   |
             v                   v
       Explore Product      Wallet Workspace
                                 |
                                 v
                          Manage Project Data
```

## Storage Workflow

The Storage Manager is designed around the following workflow:

```text
Connect Wallet
      |
      v
Storage Workspace
      |
      v
Select Asset
      |
      v
Upload
      |
      v
Store on Shelby
      |
      v
Inspect Asset
      |
      v
Retrieve / Download
```

## Metadata Workflow

NFT metadata can be created, imported, validated, previewed, and exported inside Shelby Studio.

```text
NFT Information
      |
      v
Attributes
      |
      v
Metadata
      |
      +------> Import Existing Metadata
      |
      v
Preview
      |
      v
JSON
      |
      v
Validation
      |
      v
Export
```

## Collection Workflow

Collections build on top of a project's assets and metadata.

```text
Project
   |
   +---- Assets
   |
   +---- Metadata
   |
   v
Collection Builder
   |
   +---- Collection Information
   |
   +---- Branding
   |
   +---- Preview
   |
   v
Collection Actions
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn
- An Aptos-compatible wallet for wallet-connected functionality
- Access to the Shelby environment required by the application

### Clone the repository

```bash
git clone https://github.com/Daviddforth/shelby-studio.git
cd shelby-studio
```

### Install dependencies

```bash
npm install
```

### Environment configuration

Create your local environment file:

```bash
cp .env.example .env.local
```

Configure the environment variables required by the application.

Never commit `.env.local` or private credentials to the repository.

### Start the development server

```bash
npm run dev
```

Open the application at:

```
http://localhost:3000
```

## Development

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

## Project Structure

The application is built with Next.js, React, TypeScript, and Tailwind CSS.

A simplified structure looks like:

```
shelby-studio/
├── app/
│   ├── dashboard/
│   ├── assets/
│   ├── storage/
│   ├── metadata/
│   ├── collections/
│   ├── explorer/
│   ├── developer/
│   ├── docs/
│   └── page.tsx
│
├── components/
│   ├── dashboard/
│   ├── asset-manager/
│   ├── storage/
│   ├── metadata/
│   ├── collections/
│   ├── demo/
│   ├── landing/
│   └── layout/
│
├── context/
│   └── WalletContext
│
├── public/
│
├── package.json
├── tsconfig.json
└── README.md
```

## Application Areas

### Landing Page

The public-facing introduction to Shelby Studio.

It presents the platform, its workflows, features, developer tools, and entry points into the workspace.

### Dashboard

The central project and storage workspace.

### Assets

The interface for managing digital assets.

### Storage

The Shelby-backed storage management workspace.

### Metadata

The NFT metadata creation and validation workspace.

### Collections

The NFT Collection Builder.

### Explorer

The workspace for exploring project assets and associated information.

### Developer

The developer-focused area for Shelby-related tools and resources.

## Design Principles

Shelby Studio is built around several principles.

**Project-centric**

Projects provide the organizational layer for assets, metadata, collections, storage, and publishing.

**Developer-first**

The interface is designed around the practical workflow of developers building applications with Shelby.

**Connected workflows**

The platform connects assets, metadata, collections, storage, publishing, and exploration.

**Transparent infrastructure**

The goal is to make storage and application infrastructure understandable rather than hiding it behind unrelated abstractions.

**Simple where possible**

Complex workflows should remain accessible through a focused interface.

## Roadmap

Shelby Studio is being developed incrementally.

### Completed

- Landing page
- Dashboard workspace
- Wallet connection
- Demo workspaces
- Asset management
- Storage interface
- Metadata workspace
- Metadata validation
- Collection Builder
- Explorer
- Developer workspace
- Publishing workflow foundation
- Portfolio foundation

### In Development

- AI development assistance
- Expanded developer tooling
- Additional Shelby integrations
- Expanded publishing functionality
- Improved project management
- Additional analytics
- Production hardening

## Troubleshooting

### Wallet does not connect

Make sure:

- Your Aptos-compatible wallet is installed.
- The wallet extension is enabled for the application.
- The correct network is selected.
- The browser has permission to communicate with the wallet.

### The application shows Demo Mode

Demo Mode is expected when a wallet is not connected.

Connect an Aptos-compatible wallet to access wallet-connected functionality.

### Storage functionality is unavailable

Check that:

- Your wallet is connected.
- Required environment variables are configured.
- The application is connected to the expected Shelby environment.
- Your account has the resources required for the operation.

### Build errors

Try reinstalling the project dependencies:

```bash
rm -rf node_modules
npm install
```

Then run:

```bash
npm run build
```

## Contributing

Contributions, issues, feature requests, and feedback are welcome.

Before submitting a pull request:

- Keep changes focused.
- Test affected functionality.
- Run the linter.
- Run the production build.
- Do not commit secrets or environment files.
- Provide a clear description of the change.

## License

This project is licensed under the MIT License.

## Relationship to Shelby

Shelby Studio is an independent developer project built around the Shelby ecosystem.

It is not an official Shelby Protocol product unless explicitly stated otherwise.

For information about Shelby itself, visit:

- https://shelby.xyz/
- https://docs.shelby.xyz/

## Next Steps

- Explore the Shelby Studio workspace.
- Connect an Aptos-compatible wallet.
- Create a project.
- Upload and manage assets.
- Build NFT metadata.
- Organize collections.
- Explore developer tools.
- Prepare projects for publishing.

## Links

- GitHub: https://github.com/Daviddforth/shelby-studio
- Shelby Studio: https://shelbystudio.xyz/
- X: https://x.com/ShelbyStudioHQ
