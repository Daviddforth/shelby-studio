# Shelby Studio

> A project-centric developer workspace for building, organizing, storing, publishing, and exploring applications and digital assets on the Shelby network.

Shelby Studio brings together the core workflows developers need when building applications around decentralized storage and digital assets.

Instead of switching between separate tools for storage, NFT metadata, collections, project management, publishing, and asset exploration, Shelby Studio provides these workflows inside one connected workspace.

The platform is built around a wallet-owned project model: developers connect an Aptos-compatible wallet, create projects, manage their assets and metadata, prepare collections, and move projects through a publishing workflow.

---

## Vision

Shelby Studio aims to make building on Shelby easier and more organized.

Developers should be able to move from:

**Project → Assets → Metadata → Collection → Storage → Publish → Explore**

without having to manually coordinate each stage across different tools.

The long-term goal is to provide a complete developer workspace around Shelby while keeping the underlying decentralized storage and blockchain operations understandable and accessible.

---

## Platform Overview

Shelby Studio is organized into several connected modules.

| Module | Purpose | Status |
|---|---|---|
| Dashboard | Central workspace for projects, storage, assets, and activity | Implemented |
| Projects | Create and manage wallet-specific project workspaces | Implemented |
| Storage | Upload, store, inspect, and download digital assets | Implemented |
| Explorer | Search, filter, sort, and inspect workspace assets | Implemented |
| Metadata | Create, edit, validate, and export NFT metadata | Implemented |
| Collections | Organize assets and configure NFT collections | Implemented |
| Publishing | Prepare projects and publish them through the project workflow | Implemented |
| Portfolio | Display published projects and project information | Implemented |
| Developer | Developer utilities, API exploration, SDK information, and examples | Implemented |
| AI | Intelligent development assistance | In development |

---

# Core Workflow

The primary Shelby Studio workflow is project-centric:

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

```
