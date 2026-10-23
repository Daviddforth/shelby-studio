# Engineering Decisions

Shelby Studio is a Next.js creator workspace built on the Shelby decentralized storage protocol. Creators upload video, audio, and images to Shelby, share them through public pages, go live, and use tools for raw storage, assets, NFT collections, and metadata. This document records the major engineering decisions behind the current implementation.

The goal is to make important architectural choices understandable and maintainable as the application grows.

## 1. Next.js as the Application Framework

Shelby Studio uses Next.js with the App Router as its application framework, combining:

- Browser-based application pages
- Server-rendered pages (public media, embed, and creator pages)
- Client-side interactions
- API routes
- Documentation pages
- Server-side integrations

The frontend and server-side API layer are maintained in the same repository and deployment, so no separate backend service is needed for the current requirements.

## 2. Product Areas

The application is organized around these areas:

- **Library** (`/library`) — upload video, audio, and images; edit titles, descriptions, and covers; share links
- **Public pages** — `/m/<owner>/<file>` (media page), `/embed/<owner>/<file>` (embeddable player), `/c/<owner>` (creator page)
- **Go Live** (`/live`, `/live/<owner>`) — live streaming and viewing through LiveKit
- **Raw Storage** (`/storage`) — upload, inspect, and delete files on Shelby
- **Assets** (`/assets`) and **Explorer** (`/explorer`) — browse and inspect the connected wallet's stored assets
- **Collections** and **Metadata** — NFT collection and metadata tools
- **Developer** and **Docs** — developer tools and documentation pages

## 3. Hybrid Browser and Server Architecture

**Browser** — operations requiring direct user interaction:

- Wallet connection
- Wallet signing
- Computing commitments and uploading file data directly to Shelby
- User interface state

**Server** — operations requiring protected credentials or server-side processing:

- Building transaction payloads
- Querying Shelby with the server API key
- Serving public media
- Reading and writing Postgres
- Issuing LiveKit tokens

```
Browser
│
├── UI
├── Wallet
├── Client State
└── Direct Uploads to Shelby
        │
        ▼
Next.js Server
│
├── API Routes
├── Protected Credentials
└── Database Access
```

## 4. Server-Side Secrets

Protected Shelby credentials remain server-side:

- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

These are read from server-side environment variables and are intentionally **not** exposed through `NEXT_PUBLIC_*` variables. The repository contains only configuration templates; real values belong in the deployment environment or local environment files, which are excluded from Git.

The browser-direct upload does need a key to call the Shelby RPC, so it uses a separate browser-visible key (`NEXT_PUBLIC_SHELBY_BROWSER_API_KEY`). Anything in a `NEXT_PUBLIC_*` variable is visible to every visitor and is treated as public.

## 5. Wallet-Controlled Transactions

Blockchain transactions requiring the user's authority are signed by the user's connected wallet. The server is never the user's wallet:

```
User → Connected Wallet → Transaction Approval → Shelby / Aptos
```

Registering a blob, committing it, and deleting it are each wallet-signed transactions. The server may build a payload, but it does not sign or submit it on the user's behalf. Because deletion needs a transaction from the owner account, only the owner can delete a file.

## 6. Aptos Wallet Integration

Shelby Studio uses the Aptos wallet ecosystem. The wallet layer provides:

- Wallet connection
- Wallet address
- Connection state
- Transaction signing and submission
- Message signing

Wallet state is made available through the application context (`context/WalletContext.tsx`) so storage, explorer, and library features can respond to the connected wallet.

## 7. Wallet-Signed Messages for Owner-Only Saves

Library titles, descriptions, and covers are stored in Postgres, not on-chain, so a database write needs its own proof of ownership. The server requires a wallet-signed message for each save:

```
Wallet signs: "Shelby Studio: save details for <file> | ref <hash of details> | <time>"
        │
        ▼
Server verifies
  ├── request is fresh (5 minutes)
  ├── signed text contains the expected message
  ├── public key controls the owner address
  └── signature is valid
```

The signed message includes a hash of the new details, so a signature for one change cannot be reused for a different change. The same verification is used for other wallet-signed actions, such as going live. Nothing is signed or submitted on-chain for a details save.

## 8. Wallet-Aware State

The connected wallet is the boundary for wallet-specific information. When no wallet is connected, the asset list is cleared and Explorer shows no wallet-specific assets. Search is reset when the wallet changes. This avoids showing stale information after a wallet change.

## 9. Separation of Domain Responsibilities

Major application areas have separate responsibilities:

- **Library / media** — hosting, details, and sharing of media files
- **Storage** — manage decentralized storage
- **Explorer / Assets** — browse and inspect stored assets
- **Live** — LiveKit rooms, tokens, and status
- **Metadata** — create and validate NFT metadata
- **Collections** — generate NFT collections
- **Developer** — developer-oriented tools

This prevents one module from becoming responsible for unrelated concerns.

## 10. Component-Oriented UI

The application uses feature-oriented React components, for example:

```
components/
├── dashboard/
├── storage/
├── explorer/
├── media/
├── live/
├── metadata/
├── collections/
├── developer/
├── docs/
├── layout/
├── shared/
├── ui/
└── wallet/
```

Reusable interface primitives are kept under `components/ui/` so common interface behavior is not duplicated across features.

## 11. Domain Logic Outside UI Components

Important application logic is kept outside presentation components where practical:

```
lib/
├── core/
├── live/
├── media/
├── services/
└── shelby/
```

- `lib/media/` — media type allow-list, wallet signature verification, and the details store
- `lib/live/` — LiveKit room, token, and status logic
- `lib/services/` — upload, delete, and storage services
- `lib/shelby/` — Shelby-specific client, configuration, and helpers

## 12. Shelby Integration Layer

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

Specialized workflows live under `lib/services/`. This keeps protocol-specific logic from being scattered throughout the user interface.

## 13. Browser-Direct Parallel Upload

Uploads from Library and Raw Storage go from the browser directly to the Shelby RPC:

```
Browser
 │
 ├── Generate commitments
 │
 ├── /api/storage/prepare-upload   (server builds registration payload)
 │
 ├── Wallet signs registration transaction
 ├── Wallet signs Shelby auth challenge
 │
 ├── Upload chunksets ──► Shelby RPC
 │
 ├── /api/storage/finalize-upload  (server builds commit payload)
 │
 └── Wallet signs finalize transaction
```

The server never receives the file bytes, which avoids routing large files through the Next.js server and its request limits.

Chunksets are uploaded in parallel by `lib/services/runPool.ts`:

- Up to 4 chunksets run at once.
- Each chunkset is attempted up to 6 times, with a growing pause between attempts.
- After a retry (typically a timeout on a slow connection), concurrency is halved, down to 1, and grows back one at a time after a streak of successes.
- Client errors that cannot fix themselves (400, 401, 403, 404, 409, 422) are not retried.

Parallel uploads are faster on a good connection. On a slow connection they can each hit the per-request timeout, so the pool slows itself down instead of failing the whole upload.

## 14. Disabled Server-Signed Upload Paths

Two server-side upload routes used to exist:

- `/api/storage/upload`: a server-assisted upload signed by the server signer.
- `/api/storage/stream-upload`: a server-side large-file upload.

Both signed with `SHELBY_SIGNER_PRIVATE_KEY` and had no login, size limit or rate limit, so a stranger could have stored files at the server owner's expense. The delete route had the same problem. All three now return `410 Gone`, and the NFT metadata tools use the wallet-signed browser upload instead.

The rule is simple: anything that spends or changes storage is signed by the user's wallet, never by the server on a stranger's behalf.

## 15. API Routes for Protected Operations

```
app/api/shelby/
├── asset/
├── assets/
├── delete/
├── download/
├── locations/
└── object/

app/api/storage/
├── finalize-upload/
├── prepare-upload/
├── stream-upload/
└── upload/

app/api/media/[owner]/[...name]
app/api/media-details/
app/api/live/
```

These routes provide a controlled server-side boundary for operations requiring protected configuration or server-side Shelby interaction.

## 16. Strict Media Type Allow-List

The public media route serves only a fixed list of video, audio, and image types. Anything else (HTML, SVG, JSON, executables) is refused. SVG is excluded because it can carry scripts.

Because `/api/media/...` is served from the application's own origin, serving arbitrary uploaded content there would let anyone host scriptable content on that origin. The route also sends `X-Content-Type-Options: nosniff` and `Content-Security-Policy: default-src 'none'; sandbox`.

## 17. HTTP Range Streaming

The media route supports HTTP Range requests (single `bytes=` ranges, including suffix ranges), answers 206 for valid ranges and 416 for unsatisfiable ones, and supports `HEAD` and ETag-based 304 responses.

Video and audio players need Range support to seek and to start playback without downloading the whole file. The route reads only the requested bytes from Shelby rather than the entire object.

## 18. Postgres with a Development JSON Fallback

Library titles, descriptions, and covers are small, mutable records that Shelby blobs are not suited to, so they are stored in a `media_details` table.

- In production the table is in Postgres through `DATABASE_URL` and is created on first use. Row-level security is enabled with no policies, so only the server connection can read or write it. This matters on hosts such as Supabase, where public-schema tables can otherwise be reached through a built-in API with a public key.
- In development only, when `DATABASE_URL` is not set, a JSON file at `.data/media-details.json` is used so the feature can be tried without a database. It is never used in production.

When a file is deleted from Shelby, `/api/media-details/cleanup` removes its saved details, but only after the server confirms the file is really gone.

## 19. Explorer as a Workspace Interface

Explorer provides a focused interface for browsing and inspecting the connected wallet's assets:

```
Explorer
│
├── Header
├── Search
├── Filters
├── Sorting
├── Asset Table
├── Asset Rows
└── Empty State
```

Status filters are `Stored` and `Failed`. Sorting options are Newest, Oldest, Name, Largest, and Smallest. Explorer is wallet-aware and shows no wallet-specific asset information without a connected wallet.

## 20. Metadata and Storage Separation

Metadata and storage are intentionally separate systems. Storage answers *where is the file stored?* Metadata answers *what does it represent?*

```
Asset
 │
 ├── Storage
 │     └── Shelby blob
 │
 └── Metadata
       └── NFT description or Library details
```

This lets metadata change without changing the stored file, and lets storage remain useful for content that has no NFT metadata.

## 21. Collections and Metadata Tools

Collections and Metadata are NFT tooling: generating collection metadata, validating it, and previewing NFTs. They rely on the Storage and Metadata modules for their respective responsibilities rather than owning storage themselves.

## 22. Browser State as a Convenience Only

Some interface state, such as a per-wallet activity history, is kept in the browser's `localStorage`. It is supplementary: reads and writes are wrapped so that a `localStorage` failure never breaks a storage operation. State that must persist reliably (Library details) is in Postgres, and file contents and ownership are on Shelby and Aptos.

## 23. Avoiding Unnecessary Backend Infrastructure

A separate backend service is not required: Next.js already provides the frontend and the API routes in one deployment. Postgres is the only added service for application data, and LiveKit is used as a hosted service for live streaming.

A separate backend may become appropriate if the product later needs things such as long-running workers, global asset indexing, or background monitoring. That decision should be driven by actual requirements.

## 24. Security Boundary

```
PUBLIC
│
├── UI
├── Client State
├── Wallet Interaction
├── Public Configuration
└── Direct Uploads to Shelby

          │
          ▼

PRIVATE
│
├── API Credentials
├── Signer Private Key
├── Database Connection
└── Protected Server Operations
```

Anything exposed through `NEXT_PUBLIC_*` is browser-visible. Sensitive credentials must remain server-side.

## 25. Environment Configuration

**Server-side configuration** includes:
- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`
- `DATABASE_URL`

**Browser-visible configuration** uses `NEXT_PUBLIC_*` variables where necessary, such as `NEXT_PUBLIC_SHELBY_BROWSER_API_KEY` and `NEXT_PUBLIC_SITE_URL`.

Environment files containing real values are excluded from Git by the `.env*` ignore rule; `.env.example` is kept.

## 26. Documentation as an Engineering Tool

Documentation is treated as part of the engineering process. It should describe what exists and distinguish current implementation from possible future work, so planned functionality is not presented as if it already exists.

## 27. Open Development

The source repository can contain application source code, components, domain logic, documentation, configuration templates, and engineering decisions.

Secrets must never be included in the repository. This includes private keys, API secrets, wallet seed phrases, passwords, deployment credentials, and other authentication secrets.

## 28. Current Limitations

- No global index of Shelby assets; asset lists are loaded per connected wallet.
- No background workers.
- No cross-device synchronization of browser-stored state.
- `lib/sync/` and `lib/publish/` contain only empty or stub files and are not used by any feature.

## 29. Decision-Making Principles

- **Solve the Current Problem** — do not introduce infrastructure without a concrete requirement.
- **Protect User Authority** — users stay in control of wallet-authorized transactions.
- **Protect Secrets** — sensitive credentials stay on trusted server infrastructure.
- **Prefer Clear Boundaries** — UI, state, domain logic, and infrastructure have understandable responsibilities.
- **Be Strict About What Is Served** — host only the media types we intend to host.
- **Document Important Changes** — major architectural changes should be reflected in these documents.

## Summary

Shelby Studio is a Next.js application with a hybrid browser/server architecture. The current engineering approach prioritizes:

- Wallet-controlled transactions and wallet-signed owner-only saves
- Browser-direct, parallel, adaptive chunkset uploads
- Server-side credentials
- A strict media type allow-list and HTTP Range streaming
- Postgres for Library details, with a development-only JSON fallback
- Modular feature boundaries and Shelby-specific integration layers
- Lightweight infrastructure
