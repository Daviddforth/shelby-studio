# Dashboard

The Dashboard is the central workspace of Shelby Studio. It provides an overview of the active development environment and brings together project information, storage activity, network status, recent assets, and common workspace actions.

The Dashboard is designed to give developers a quick understanding of the current state of their Shelby Studio workspace without requiring them to inspect each module individually.

## Overview

The Dashboard connects several parts of the Shelby Studio platform:

```
Dashboard
│
├── Project Context
├── Network Status
├── Storage Overview
├── Project Statistics
├── Recent Assets
├── Recent Activity
└── Quick Actions
```

The Dashboard is primarily an aggregation and navigation layer. It does not replace the specialized Storage, Explorer, Projects, Collections, or Metadata workspaces.

## Architecture

**Dashboard components:**
```
components/dashboard/
├── DashboardHero.tsx
├── DashboardStats.tsx
├── NetworkStatus.tsx
├── QuickActions.tsx
├── RecentActivity.tsx
├── RecentAssets.tsx
└── StorageOverview.tsx
```

Additional dashboard-related components exist in the shared component layer.

**Dashboard page:**
```
app/dashboard/page.tsx
```

**Broader dashboard component:**
```
components/Dashboard.tsx
```

The exact responsibility of these components may evolve as the workspace architecture continues to mature.

### Layout

The Dashboard follows a workspace-oriented layout:

```
Dashboard
│
├── Header / Hero
├── Network Status
├── Project / Workspace Statistics
├── Storage Overview
├── Recent Assets
├── Recent Activity
└── Quick Actions
```

This structure prioritizes information that developers are likely to need when returning to an active project.

## Project Context

The Dashboard is connected to the project system. The active project provides context for workspace information such as:

- Project identity
- Project status
- Project assets
- Storage information
- Collection information
- Publication information
- Recent project activity

The project-centric model allows the Dashboard to represent the state of the selected workspace rather than presenting unrelated global information.

## Core Components

### Dashboard Hero

Provides the primary introduction to the workspace — a high-level entry point into the active project and context for the information displayed below it. The Hero stays focused on orientation rather than duplicating detailed information already available in specialized modules.

### Network Status

Provides information about the connected network environment. This matters because Shelby Studio interacts with the Shelby ecosystem and Aptos wallet infrastructure.

```
Wallet
   │
   ▼
Network Context
   │
   ├── Shelby Environment
   └── Aptos Environment
```

Network information should be treated as runtime configuration — not proof that an asset has been successfully stored or published.

### Dashboard Statistics

Provides a compact overview of the current workspace, potentially including:

- Asset count
- Metadata count
- Collection count
- Storage usage
- Project status
- Publication status

These values should be derived from actual project state where possible. The Dashboard should avoid displaying hardcoded values that imply activity which has not occurred.

### Storage Overview

Provides a high-level representation of storage activity associated with the workspace. The Storage module remains responsible for detailed storage operations — the Dashboard simply surfaces an overview:

```
Project
   │
   ▼
Storage Overview
   │
   ├── Stored Assets
   ├── Storage Usage
   └── Recent Storage Activity
```

Developers move from the Dashboard into the Storage workspace when detailed operations are required.

### Recent Assets

Provides a quick view of recently relevant project assets, letting developers return to active work without navigating through the complete Storage or Explorer interfaces. The detailed asset workflow remains within the Storage and Explorer modules.

### Recent Activity

Provides a high-level view of workspace activity, associated with operations such as:

- Asset uploads
- Project changes
- Metadata changes
- Collection activity
- Publication activity

Activity should represent actual application state where available. As the platform develops, the activity system may become more persistent and comprehensive.

### Quick Actions

Provide shortcuts into common workflows — potential navigation targets include:

- Storage
- Metadata
- Collections
- Projects
- Explorer
- Developer tools

The purpose of Quick Actions is to reduce navigation overhead, not duplicate the functionality of the destination module.

## Relationships to Other Systems

### Storage

The Dashboard summarizes storage information; Storage handles storage operations:

```
Dashboard
    │
    │ Overview
    ▼
Storage
    │
    ├── Upload
    ├── Download
    ├── Inspect
    └── Manage
```

This separation keeps the Dashboard lightweight while Storage remains the authoritative workspace for detailed asset operations.

### Explorer

Explorer provides a more detailed asset browsing experience. The Dashboard surfaces recent assets, while Explorer provides search, filtering, sorting, and inspection:

```
Dashboard
   │
   └── Recent Assets
            │
            ▼
         Explorer
            │
            ├── Search
            ├── Filter
            ├── Sort
            └── Inspect
```

### Projects

Projects provide the primary organizational boundary for Shelby Studio. The Dashboard presents information about the active project, while the Projects workspace handles creating, listing, selecting, and managing projects:

```
Projects
    │
    ▼
Active Project
    │
    ▼
Dashboard
```

### Collections

Collections are organized within projects. The Dashboard may surface collection statistics or activity, while the Collections workspace provides the detailed collection workflow:

```
Dashboard
   │
   └── Collection Overview
             │
             ▼
        Collections
             │
             ├── Information
             ├── Assets
             ├── Metadata
             └── Preview
```

### Metadata

The Dashboard can provide a high-level representation of metadata activity, while the Metadata workspace handles NFT information, attributes, images, templates, validation, JSON preview, import, and metadata actions. The Dashboard should not become responsible for implementing metadata generation or validation itself.

### Publication

Publication information is increasingly important to the project workspace. A project may contain:

- Publication status
- Publication completion
- Publication date
- Owner
- Network
- Manifest information
- Registration transaction
- Commit transaction
- Transaction hash
- Storage URI
- Explorer URL

The Dashboard can surface a high-level publication state, while the Project Dashboard and Portfolio provide more detailed publication information:

```
Project
   │
   ▼
Publication
   │
   ├── Status
   ├── Transactions
   ├── Storage
   └── Explorer Information
```

Publication status should be derived from the project publication record, not assumed from the existence of a project.

## Wallet Awareness

Shelby Studio is wallet-aware. The connected wallet determines which project and workspace information should be available to the user — particularly for project and asset data. The Dashboard should avoid presenting stale wallet-specific information after a wallet disconnects or changes.

```
Wallet
   │
   ▼
Workspace Context
   │
   ▼
Active Project
   │
   ▼
Dashboard
```

## Dashboard Data Flow

```
Connected Wallet
       │
       ▼
Project Context
       │
       ▼
Active Project
       │
       ├── Assets
       ├── Storage
       ├── Metadata
       ├── Collections
       ├── Activity
       └── Publication
              │
              ▼
          Dashboard
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
    Stats  Recent  Actions
             Data
```

This makes the Dashboard primarily a consumer of project and application state.

## Current Implementation

The current Dashboard foundation includes:

- Dashboard page
- Dashboard Hero
- Dashboard statistics
- Network status
- Quick Actions
- Recent Activity
- Recent Assets
- Storage Overview
- Project-aware workspace context

The Dashboard serves as the central overview layer for the current application.

## Current Limitations

The current Dashboard should not be interpreted as a complete analytics platform. The current architecture does not yet provide a dedicated persistent analytics backend for:

- Historical storage analytics
- Global asset indexing
- Cross-project analytics
- Organization-level metrics
- Real-time network indexing
- Long-term activity aggregation

Current dashboard information is therefore constrained by the project and application state available to the client.

## Planned Development

- **Persistent Analytics** — store historical workspace information so developers can inspect changes over time
- **Storage Analytics** — deeper insight into storage consumption, upload volume, asset growth, and storage activity
- **Project Analytics** — project-level statistics including asset growth, metadata progress, collection progress, and publication progress
- **Publication Analytics** — clearer insight into publication history, transaction states, published assets, and publication completion
- **Cross-Project Overview** — understand activity across multiple projects while maintaining project isolation
- **Activity History** — persistent activity records rather than relying only on current application state
- **Team Analytics** — if team workspaces are introduced, organization-level activity and usage information

### Future Dashboard Architecture

As persistent infrastructure is introduced, the Dashboard could evolve toward:

```
                 Dashboard
                     │
          ┌──────────┼──────────┐
          │          │          │
       Project    Storage    Activity
        Data       Data        Data
          │          │          │
          └──────────┼──────────┘
                     │
                  Database
                     │
              Background Sync
                     │
                     ▼
              Shelby / Aptos
```

This architecture would allow historical and cross-device information to be displayed without requiring the browser to reconstruct the entire history of a project. Such infrastructure should only be introduced when product requirements justify it.

## Engineering Principles

- **Overview Rather Than Duplication** — the Dashboard should summarize information rather than reimplement every specialized workflow.
- **Project-Centric** — Dashboard information should respect the active project boundary.
- **Wallet-Aware** — wallet changes should affect access to wallet-specific workspace state.
- **Derived Information** — statistics and status indicators should be derived from actual application state whenever possible.
- **Modular** — Dashboard sections should remain independently maintainable.
- **Extensible** — the Dashboard should be able to consume future persistent analytics without requiring a complete redesign.

## Summary

The Dashboard is the central overview layer of Shelby Studio. It connects project state, storage information, network context, recent assets, recent activity, statistics, and navigation into a single workspace. It does not replace the specialized Storage, Explorer, Metadata, Collections, Projects, or Publication workflows.

The current implementation provides the foundation for a project-centric developer dashboard, while future development can introduce persistent analytics, historical activity, cross-project insights, publication analytics, and team-level reporting as the platform grows.