# Shelby Studio

> An integrated developer workspace for building applications on the Shelby network.

Shelby Studio is an open developer platform designed to simplify how developers build, manage and scale decentralized applications powered by Shelby.

Rather than focusing on a single workflow, Shelby Studio brings together storage management, metadata creation, collections, project organization, developer tooling and asset exploration into one unified workspace.

The platform provides a modern interface for interacting with Shelby while hiding much of the complexity involved in decentralized storage operations.

---

## Vision

Shelby Studio exists to make building on Shelby more approachable.

Developers should spend their time building applications—not managing storage infrastructure, organizing files or repeatedly performing manual workflows.

By combining powerful storage capabilities with intuitive tooling, Shelby Studio provides a complete environment for developing decentralized applications from a single interface.

---

## Platform Overview

Shelby Studio is organized into several independent modules that work together as a unified platform.

| Module | Purpose |
|---------|---------|
| Dashboard | Central workspace for projects and storage activity |
| Storage | Upload, download and manage decentralized assets |
| Explorer | Browse, inspect and verify stored objects |
| Metadata | Create and validate NFT metadata |
| Collections | Organize related assets into reusable collections |
| Projects | Manage application workspaces |
| Portfolio | View published assets and project summaries |
| Developer | APIs, SDK utilities and future developer tools |
| AI | Planned intelligent development assistant |

---

## Current Capabilities

### Storage

- Upload assets to Shelby
- Query stored objects
- Download stored assets
- Replace existing objects without changing their identity
- Verify storage operations directly from Shelby

### Asset Management

- Browse uploaded assets
- Inspect object metadata
- View storage information
- Search and organize stored content

### Metadata

- Create NFT metadata
- Attribute management
- Metadata validation
- JSON generation
- Live metadata preview

### Project Workspace

- Dashboard
- Project organization
- Collection management
- Portfolio pages
- Developer workspace

---

## Architecture

Shelby Studio follows a layered architecture that separates the user interface, application logic and decentralized storage infrastructure.

```text
                Browser

                    │

                    ▼

           React + Next.js UI

                    │

                    ▼

          Next.js API Routes

                    │

                    ▼

              Shelby SDK

                    │

                    ▼

             Shelby Network

                    │

                    ▼

          Distributed Storage Providers
```

This architecture ensures that sensitive operations remain on the server while providing developers with a clean, intuitive interface for interacting with decentralized storage.

---

## Documentation

Shelby Studio includes a comprehensive developer documentation library covering both the platform architecture and implementation details.

| Document | Description |
|----------|-------------|
| Introduction | Overview of Shelby Studio |
| Philosophy | Design principles and development philosophy |
| Architecture | Platform architecture and system design |
| Storage Engine | Storage architecture and lifecycle |
| Upload Pipeline | Complete upload workflow |
| Explorer | Asset browsing and inspection |
| Metadata | Metadata creation and validation |
| Collections | Asset organization |
| Dashboard | Central developer workspace |
| Engineering Decisions | Architectural reasoning and implementation choices |

Detailed documentation is available inside the `docs/` directory.

---

## Platform Status

Shelby Studio is currently under active development.

### Implemented

- ✅ Shelby Storage Integration
- ✅ Upload Assets
- ✅ Download Assets
- ✅ Replace Existing Objects
- ✅ Object Verification
- ✅ Asset Explorer
- ✅ Dashboard
- ✅ Metadata Workspace
- ✅ Collections Workspace
- ✅ Project Management Foundation
- ✅ Portfolio Pages
- ✅ Developer Workspace
- ✅ Comprehensive Documentation

### In Progress

- 🚧 Delete Objects
- 🚧 Explorer Actions
- 🚧 Collection Builder
- 🚧 Dashboard Analytics
- 🚧 Metadata Templates

### Planned

- Version History
- Asset Recovery
- NFT Deployment Workflows
- Collection Publishing
- Marketplace Integrations
- Team Collaboration
- AI Development Assistant

---
## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Daviddforth/shelby-studio.git
```

Navigate into the project directory.

```bash
cd shelby-studio
```
---

### Install Dependencies

```bash
npm install
```

---

### Configure Environment Variables

Create a local environment file.

```bash
cp .env.example .env.local
```

Configure the required Shelby and Aptos credentials.

```env
SHELBY_API_KEY=

SHELBY_SIGNER_PRIVATE_KEY=

NEXT_PUBLIC_NETWORK=Shelbynet
```

---

### Start the Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## Project Structure

```text
app/
│
├── api/
│     ├── shelby/
│     └── storage/
│
├── dashboard/
├── storage/
├── explorer/
├── metadata/
├── collections/
├── projects/
├── portfolio/
├── developer/
└── docs/

components/

context/

hooks/

lib/

docs/

public/
```

The project is organized into independent modules to keep storage, metadata, collections, projects and user interface logic isolated from one another.

---

## Contributing

Shelby Studio is actively evolving.

Contributions that improve developer experience, documentation, storage workflows or platform capabilities are welcome.

When contributing:

- Keep components modular.
- Follow the existing project architecture.
- Document significant architectural changes.
- Keep pull requests focused on a single improvement.
- Test storage operations before submitting changes.

---

## Roadmap

Current priorities include:

- Complete Explorer actions
- Delete object support
- Dashboard analytics
- Collection Builder
- Metadata improvements
- Version history
- Recovery workflows
- NFT deployment pipeline
- Marketplace integrations
- AI-assisted development

The long-term objective is to establish Shelby Studio as a complete developer platform for building applications on the Shelby network.

---

## Maintainer

**Daviddforth**

Shelby Studio is developed as an open platform focused on improving the developer experience for applications built on Shelby.

---

## License

This project is currently released under the **MIT License**.

See the `LICENSE` file for additional information.
---

# Why Shelby Studio?

Building decentralized applications often requires developers to work across multiple disconnected tools.

Managing storage, organizing assets, creating metadata, validating files and preparing projects for deployment frequently involves repetitive workflows and unnecessary complexity.

Shelby Studio brings these capabilities together into a single developer workspace.

Instead of treating storage as an isolated feature, Shelby Studio provides a complete environment for managing decentralized application assets throughout their lifecycle.

---

# Core Principles

Shelby Studio is guided by a small set of engineering principles.

### Developer First

Every workflow should reduce friction rather than introduce it.

---

### Modular by Design

Each subsystem is designed to evolve independently while remaining part of a unified platform.

---

### Transparent Storage

Developers should always understand the current state of their assets.

Storage operations are verified directly against Shelby whenever possible.

---

### Scalable Architecture

The platform is designed for incremental growth.

New modules can be introduced without redesigning the existing architecture.

---

### Documentation Matters

Good software deserves good documentation.

Every major subsystem is documented to help developers understand not only how the platform works, but why it was designed that way.

---

# Future Vision

Shelby Studio is being developed as a complete developer platform for the Shelby ecosystem.

Future releases will expand beyond storage management into a broader suite of tools for decentralized application development, including project collaboration, NFT deployment workflows, analytics, automation and intelligent developer assistance.

The long-term goal is to provide developers with a single workspace for building, managing and scaling applications on Shelby.

---

# Acknowledgements

Shelby Studio is inspired by the vision of making decentralized storage more accessible to developers.

Special thanks to the Shelby community for building the infrastructure that makes this platform possible.
