# Storage Engine

Shelby Studio uses Shelby as its decentralized storage infrastructure.

The storage engine is responsible for connecting the application workspace with Shelby storage operations while keeping project, wallet, asset, and storage information organized within the application.

The storage layer is designed to support both server-assisted operations and browser-direct workflows.

---

## Storage Responsibilities

The storage layer is responsible for:

- Preparing storage operations
- Uploading assets
- Streaming large uploads
- Supporting browser-direct uploads
- Finalizing uploads
- Downloading stored objects
- Querying object information
- Tracking storage information
- Associating stored assets with projects
- Providing storage information to Explorer and project dashboards

Storage is therefore treated as an application subsystem rather than as a collection of isolated API calls.

---

## Storage Architecture

The storage system is organized into several layers.

```text
                         Storage Engine
                              │
              ┌───────────────┴───────────────┐
              │                               │
          Browser                         Next.js Server
              │                               │
      ┌───────┴────────┐              ┌───────┴────────┐
      │                │              │                │
   Wallet          Direct Upload    API Routes      Services
      │                │              │                │
      └────────────────┴──────────────┴────────────────┘
                              │
                              ▼
                           Shelby
                              │
                              ▼
                        Stored Objects
```

The browser and server cooperate where necessary.

Large file data can use browser-direct workflows, while server-side routes remain available for operations that require server-side configuration or application logic.

---

## Storage Libraries

Storage-related functionality is distributed across the application libraries.

Core storage functionality includes:

```text
lib/core/
└── storage.ts
```

Shelby-specific storage integration includes:

```text
lib/shelby/
└── storage.ts
```

Storage services include:

```text
lib/services/
├── storage.ts
├── shelbyLargeUpload.ts
├── shelbyStreamingUpload.ts
└── shelbyBrowserDirectUpload.ts
```

These layers allow general application storage logic to remain separate from Shelby-specific implementation details.

---

## Storage API Routes

The application exposes server-side storage routes under:

```text
app/api/storage/
├── prepare-upload/
├── upload/
├── stream-upload/
└── finalize-upload/
```

Shelby-specific routes are also available under:

```text
app/api/shelby/
├── asset/
├── assets/
├── download/
├── locations/
└── object/
```

The API routes provide the server-side boundary for operations that should not require exposing protected application configuration to the browser.

---

## Upload Models

Shelby Studio supports multiple upload approaches:

- Server-assisted upload
- Streaming upload
- Large-file upload
- Browser-direct upload

The appropriate workflow depends on the size of the asset and the operation being performed.

---

## Server-Assisted Upload

A server-assisted workflow allows the browser to communicate with a Next.js API route.

A simplified flow is:

```text
User
 │
 ▼
Select File
 │
 ▼
Browser
 │
 │ Upload Request
 ▼
Next.js API
 │
 ├── Validate request
 ├── Access server configuration
 ├── Communicate with Shelby
 │
 ▼
Shelby
 │
 ▼
Upload Result
 │
 ▼
Browser
```

This model is useful when the server needs to participate directly in the storage operation.

---

## Upload Preparation

The application contains a dedicated preparation route:

```text
/api/storage/prepare-upload
```

Preparation allows the server and browser to establish the information required before the actual data transfer begins.

The preparation stage can include information such as:

- Blob name
- Owner
- File size
- Chunk information
- Expiration information
- Transaction payload

The server prepares the operation but does not automatically imply that the user's wallet has authorized the resulting blockchain transaction.

---

## Browser-Direct Upload

For supported large-file workflows, Shelby Studio can transfer file data directly from the browser toward Shelby.

The browser-direct service is:

```text
lib/services/shelbyBrowserDirectUpload.ts
```

The purpose of this architecture is to avoid routing large file payloads unnecessarily through the application server.

A simplified workflow is:

```text
User
 │
 ▼
Select File
 │
 ▼
Browser
 │
 ├── Generate commitments
 │
 ├── Request preparation
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
 │
 ├── Transfer data
 │
 ▼
Shelby
 │
 ▼
Finalize
 │
 ▼
Project / Asset State
```

This approach can reduce server bandwidth requirements for large files.

---

## Commitment Generation

The browser-direct upload implementation can generate Shelby commitments locally before transferring the file.

The general process is:

```text
File
 │
 ▼
Erasure Coding Provider
 │
 ▼
Commitment Generation
 │
 ▼
Upload Preparation
```

The implementation uses Shelby SDK browser functionality for the commitment process.

Generating commitments locally also allows the application to validate that the commitment metadata corresponds to the selected file before proceeding.

---

## Wallet Authorization

Some storage workflows require blockchain transactions to be authorized by the connected Aptos wallet.

Shelby Studio therefore separates:

- **Operation Preparation**
- **Wallet Authorization**

The application can prepare transaction information server-side while the connected wallet remains responsible for signing and submitting user-authorized transactions.

This is an important security and ownership boundary.

---

## Streaming Uploads

The application includes a streaming upload service:

```text
lib/services/shelbyStreamingUpload.ts
```

Streaming workflows are intended to support storage operations where data should be processed progressively rather than requiring the entire file to be handled as a single in-memory operation.

This is particularly relevant for larger assets.

---

## Large File Uploads

Large file functionality is supported through:

```text
lib/services/shelbyLargeUpload.ts
```

The large upload layer is responsible for coordinating progress and storage operations for larger assets.

The interface can expose progress information such as:

- Current phase
- Uploaded bytes
- Total bytes
- Percentage

This allows the UI to communicate the state of a long-running upload to the user.

---

## Upload Lifecycle

A typical upload lifecycle can be represented as:

```text
Select File
    │
    ▼
Validate File
    │
    ▼
Prepare Upload
    │
    ▼
Generate / Prepare Commitments
    │
    ▼
Authorize Transaction
    │
    ▼
Transfer Data
    │
    ▼
Receive Storage Provider Responses
    │
    ▼
Finalize Upload
    │
    ▼
Record Asset Information
    │
    ▼
Verify / Inspect
    │
    ▼
Update Project State
```

Not every upload path uses exactly the same sequence.

The lifecycle depends on whether the operation uses the server, browser-direct transfer, streaming, or another Shelby workflow.

---

## Upload Progress

The storage services provide progress information that can be used by the application interface.

A progress state can include:

- Phase
- Uploaded Bytes
- Total Bytes
- Percentage

This allows the application to distinguish between different stages of an operation rather than displaying a single generic loading state.

Example phases may include:

- Preparing
- Registering
- Uploading
- Finalizing
- Completed

The exact phases depend on the upload implementation.

---

## Finalization

After data transfer and required authorization steps are completed, the upload can be finalized through:

```text
/api/storage/finalize-upload
```

Finalization is important because successful data transfer alone does not necessarily represent a fully completed storage workflow.

The finalization stage can return information required by the application to associate the resulting storage operation with the project and asset record.

---

## Asset Records

Once an asset has been stored, Shelby Studio can associate information about the asset with the project.

Asset information can be used by:

- Storage
- Explorer
- Project dashboards
- Portfolio workflows
- Publication workflows

The application can track information such as:

- Asset identity
- File information
- Storage information
- Transaction information
- Project association
- Upload state

The exact fields depend on the current project and storage models.

---

## Project and Storage Relationship

Storage is project-aware.

The relationship can be represented as:

```text
Project
   │
   └── Project Assets
          │
          ├── Asset
          ├── Storage Information
          ├── Metadata
          └── Activity
```

This allows the project dashboard to present storage information alongside other project information.

It also allows publication workflows to use project storage state when determining project readiness.

---

## Storage Usage

Project views can expose storage-related information such as:

- Storage Used
- Asset Count

This information can be used by project dashboards and other presentation components.

Future versions can expand this into more detailed storage analytics.

---

## Download Architecture

Shelby Studio provides server-side download functionality through:

```text
/api/shelby/download
```

The application can use this functionality to retrieve stored objects from Shelby and provide them to the user.

A simplified flow is:

```text
User
 │
 ▼
Asset
 │
 ▼
Download Action
 │
 ▼
Next.js API
 │
 ▼
Shelby
 │
 ▼
Stored Object
 │
 ▼
Browser
```

---

## Object Queries

The application contains Shelby API routes for querying stored information, including:

- `/api/shelby/asset`
- `/api/shelby/assets`
- `/api/shelby/object`
- `/api/shelby/locations`

These routes provide access to storage information that can be used by application features such as Explorer and asset inspection.

---

## Object Inspection

Explorer and storage interfaces can use object information to help developers inspect stored assets.

The goal is to provide visibility into the storage state instead of treating storage as an opaque operation.

Inspection can include information such as:

- Object identity
- Storage location
- Asset information
- Storage status
- Transaction information where available

---

## Verification

Verification is an important principle of the storage engine.

The application should not assume that an operation succeeded merely because a request was sent.

Storage-related state should be based on available evidence from the operation and the resulting storage information.

Verification may involve:

```text
Upload Result
     │
     ▼
Storage Information
     │
     ▼
Object Inspection
     │
     ▼
Application State
```

The exact verification mechanism depends on the storage operation.

---

## Storage and Publication

Storage is closely connected to project publication.

A project may require storage-related information before it can be considered ready for publication.

The relationship is:

```text
Project
 │
 ├── Assets
 │
 └── Storage
       │
       ▼
Publication Validation
       │
       ▼
Publication Workflow
```

Publication information can then reference storage information such as:

- Manifest blob
- Storage URI
- Transaction information
- Network

This creates a connection between the storage engine and project publication system.

---

## Storage and Explorer

Explorer provides a user-facing interface over stored asset information.

The relationship is:

```text
Storage Services
       │
       ▼
Project Asset State
       │
       ▼
Explorer
       │
 ┌─────┼─────────┐
 ▼     ▼         ▼
Search Filter   Sort
```

The current Explorer supports:

- Asset search
- Status filtering
- Sorting
- Asset inspection
- Empty states
- Published project views

---

## Storage and Wallets

Wallets are involved in storage workflows where transactions require user authorization.

The general relationship is:

```text
User
 │
 ▼
Connected Wallet
 │
 ▼
Authorize Transaction
 │
 ▼
Shelby Storage Operation
```

Shelby Studio does not require the application to custody a user's wallet private key.

The user's wallet remains responsible for user-authorized blockchain transactions.

---

## Server-Side Credentials

Server-side Shelby credentials are used only from server-side code. Examples include:

- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

These values must remain private. They must never be placed in `NEXT_PUBLIC_*` variables, and must never be committed to the Git repository.

The application's `.gitignore` excludes `.env*` files.

---

## Storage Security Boundary

The storage architecture can be summarized as:

```text
PUBLIC / BROWSER
│
├── File selection
├── Upload interface
├── Wallet interaction
├── Progress display
└── Supported direct transfer
          │
          │
      SERVER BOUNDARY
          │
          ▼
PRIVATE / SERVER
│
├── Protected credentials
├── Server-side Shelby operations
├── Upload preparation
└── Server-side application logic
```

This boundary allows the application to support browser-direct storage without exposing protected server configuration.

---

## Failure Handling

Storage operations can fail at different stages.

Potential failure points include:

- File validation
- Commitment generation
- Upload preparation
- Wallet authorization
- Data transfer
- Storage provider response
- Transaction submission
- Finalization
- Object inspection

The application should surface meaningful failure information rather than treating every failure as a generic upload error.

This allows users to understand which stage of the workflow failed.

---

## Current Storage Capabilities

The current storage engine provides a foundation for:

- Shelby integration
- Asset uploads
- Large-file workflows
- Streaming uploads
- Browser-direct uploads
- Upload preparation
- Upload finalization
- Downloads
- Object queries
- Storage inspection
- Project asset association
- Wallet-authorized storage operations

These capabilities form the storage foundation for the wider Shelby Studio platform.

---

## Current Limitations

The storage engine is still evolving.

The current architecture does not yet provide a complete system for:

- Global Shelby asset indexing
- Multi-device storage synchronization
- Real-time storage activity feeds
- Organization-wide storage permissions
- Large-scale analytics
- Background storage indexing
- Full storage history across every project state

These capabilities can be added as the platform develops.

---

## Planned Development

Future storage development may include:

**Object Management**
- Additional object operations
- Improved object inspection
- Expanded object lifecycle controls

**Explorer**
- Broader asset discovery
- Advanced search
- Batch operations
- Version history

**Project Storage**
- Persistent project storage
- Cross-device synchronization
- Storage history
- Recovery workflows

**Infrastructure**
- Asset indexing
- Background workers
- Storage analytics
- Audit history

The timing and implementation of these features will depend on product requirements and Shelby infrastructure evolution.

---

## Design Principles

The storage engine follows several principles.

**Keep Large Data Off the Application Server When Appropriate**
Browser-direct workflows can prevent unnecessary server bandwidth usage.

**Keep User Authorization With the User**
Wallet-controlled transactions should remain under the user's authority.

**Protect Server Credentials**
Server-side credentials must remain behind the server boundary.

**Verify Important Operations**
The application should use actual storage information when determining operation state.

**Keep Storage Project-Aware**
Stored assets should remain connected to the project context where appropriate.

**Keep Storage Modular**
Shelby-specific infrastructure should remain separated from UI components.

---

## Summary

The Shelby Studio storage engine provides the infrastructure layer connecting projects and assets to Shelby decentralized storage.

It supports server-assisted operations, streaming workflows, large-file handling, browser-direct uploads, downloads, object queries, finalization, and storage inspection.

The architecture separates browser responsibilities from server responsibilities while keeping wallet authorization under user control and protected Shelby credentials on the server.

Storage forms one of the core foundations of Shelby Studio and is also a dependency for Explorer, project dashboards, and publication workflows.

Future development can extend the storage engine with persistent indexing, synchronization, recovery, analytics, and more advanced object management without requiring a complete replacement of the current architecture.