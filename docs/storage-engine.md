# Storage Engine

Shelby Studio uses Shelby as its decentralized storage infrastructure.

The storage engine connects the application (Library, Raw Storage, Assets, Explorer, and the NFT metadata tools) to Shelby storage operations. File bytes live on Shelby. Small pieces of application data, such as titles, descriptions, and covers for Library files, live in Postgres.

The storage layer supports both browser-direct workflows and a small number of server-side operations.

---

## Storage Responsibilities

The storage layer is responsible for:

- Preparing storage operations
- Uploading files
- Registering and finalizing uploads with wallet-signed transactions
- Deleting files (owner only, wallet-signed)
- Downloading and streaming stored objects
- Querying object information
- Providing storage information to Explorer, Assets, and Raw Storage

---

## Storage Architecture

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

The browser and server cooperate where necessary. File data is uploaded from the browser straight to the Shelby RPC. Server routes build transaction payloads, answer queries, and serve public media.

---

## Storage Libraries

Storage-related functionality is distributed across the application libraries.

```text
lib/core/
└── storage.ts

lib/shelby/
└── storage.ts

lib/services/
├── storage.ts
├── runPool.ts
├── shelbyBrowserDirectUpload.ts
├── shelbyDelete.ts
├── shelbyLargeUpload.ts
└── shelbyStreamingUpload.ts

lib/media/
├── auth.ts
├── clientSign.ts
├── db.ts
├── server.ts
└── types.ts
```

- `shelbyBrowserDirectUpload.ts` implements the browser upload described below.
- `runPool.ts` runs the chunkset uploads with limited, adaptive concurrency.
- `shelbyDelete.ts` builds and submits the wallet-signed delete transaction.
- `shelbyLargeUpload.ts` holds the shared progress type and upload-mode helpers (a 100 MB threshold used for UI purposes).
- `shelbyStreamingUpload.ts` is the old server-side upload that signed with the server signer. Its route, `/api/storage/stream-upload`, is disabled (`410 Gone`) and nothing calls it.
- `lib/media/` handles media lookups, the media type allow-list, wallet-signed saves, and the Postgres store for Library details.

---

## Storage API Routes

```text
app/api/storage/
├── prepare-upload/
├── upload/
├── stream-upload/
└── finalize-upload/

app/api/shelby/
├── asset/
├── assets/
├── delete/
├── download/
├── locations/
└── object/

app/api/media/[owner]/[...name]
app/api/media-details/
└── cleanup/
```

The API routes are the server-side boundary for operations that need protected configuration such as `SHELBY_API_KEY` or `SHELBY_SIGNER_PRIVATE_KEY`.

`/api/storage/upload` and `/api/storage/stream-upload` are disabled and return `410 Gone`, because they signed with the server signer for anyone who called them. The NFT metadata tools now store generated `metadata.json` files with the same wallet-signed browser upload as the Library, so the connected wallet approves and pays.

---

## Browser-Direct Upload

Library and Raw Storage uploads go through `uploadDirectlyToShelby` in `lib/services/shelbyBrowserDirectUpload.ts`. The purpose is to keep large file payloads off the application server.

```text
User
 │
 ▼
Select File
 │
 ▼
Browser
 │
 ├── Generate commitments (Shelby SDK, erasure coding)
 │
 ├── Request preparation  ──►  /api/storage/prepare-upload
 │
 ├── Wallet signs registration transaction
 │
 ├── Wallet signs a Shelby auth challenge message
 │
 ├── Upload chunksets  ──►  Shelby RPC (parallel, adaptive)
 │
 ├── Request commit payload  ──►  /api/storage/finalize-upload
 │
 └── Wallet signs finalize transaction
```

The steps are:

1. **Commitments.** The browser reads the file and generates Shelby commitments locally with the Shelby SDK.
2. **Prepare.** The server builds the registration transaction payload. It does not sign or submit it.
3. **Register.** The connected wallet signs and submits the registration transaction. The browser waits for it to be visible on the network.
4. **Authenticate.** The wallet signs a challenge from the Shelby RPC so the browser may upload for that account.
5. **Upload chunksets.** The browser sends the file in chunksets directly to the Shelby RPC and collects the storage provider acknowledgements.
6. **Finalize.** The server builds the commit transaction payload from the acknowledgements. The wallet signs and submits it.

The server never receives the file bytes on this path.

---

## Parallel, Adaptive Chunkset Upload

Chunksets are uploaded by `runPool` in `lib/services/runPool.ts`:

- Up to 4 chunksets are in flight at once.
- Each chunkset is attempted up to 6 times, with a pause that grows with each attempt.
- When a chunkset has to be retried (for example after a timeout on a slow connection), the allowed concurrency is halved, down to a minimum of 1. After a streak of successful chunksets it grows back one at a time, up to 4.
- Errors that will not fix themselves (HTTP 400, 401, 403, 404, 409, 422) are not retried.
- The first chunkset that finally fails stops the remaining ones and its error is thrown.

The reason is that many parallel requests on a slow connection each get a thin slice of bandwidth and can hit the server's per-request timeout. Slowing down after a timeout lets the upload finish instead of failing.

---

## Wallet Authorization

Storage workflows that change on-chain state are authorized by the connected Aptos wallet:

- Registering a blob (upload)
- Committing a blob (finalize)
- Deleting a blob

The server can prepare transaction payloads, but the wallet is the only party that signs and submits them. The application does not custody a user's wallet private key. This is an important security and ownership boundary.

Deleting a file is a wallet-signed transaction built by `shelbyDelete.ts`, so only the owner account can delete a file.

---

## Upload Progress

The upload reports progress through a callback with:

- Phase
- Uploaded bytes
- Total bytes
- Percentage
- Current chunkset and total chunksets (while uploading)

The progress phases are `preparing`, `commitments`, `registering`, `uploading`, `committing`, and `complete`. Not every phase is reported by every code path.

This lets the interface show which stage a long upload has reached instead of a single loading state.

---

## Download and Streaming

Two read paths exist:

- `/api/shelby/download` retrieves a stored object through the server for download.
- `/api/media/[owner]/[...name]` serves Library media for playback and embedding.

The media route:

- Serves only file types on a fixed allow-list (see Media Type Allow-List below).
- Supports HTTP Range requests (single `bytes=` ranges, including suffix ranges), answering with 206 for valid ranges and 416 for unsatisfiable ones, so video and audio can seek.
- Supports `HEAD` and `If-None-Match` (ETag, 304).
- Sends `X-Content-Type-Options: nosniff` and a `Content-Security-Policy: default-src 'none'; sandbox` header so the app origin cannot run hosted content.

Public pages built on top of it are `/m/<owner>/<file>` (media page), `/embed/<owner>/<file>` (embeddable player), and `/c/<owner>` (creator page).

---

## Media Type Allow-List

Only these extensions are ever served by the public media route:

- Video: mp4, m4v, webm, mov, ogv
- Audio: mp3, wav, m4a, aac, ogg, oga, opus, flac
- Image: jpg, jpeg, png, gif, webp, avif

Anything else (HTML, SVG, JSON, executables) is refused. SVG is excluded on purpose because it can carry scripts.

---

## Library Details in Postgres

Titles, descriptions, and cover images for Library files are saved in a `media_details` table, keyed by owner and blob name.

- In production the table lives in Postgres through `DATABASE_URL`. It is created automatically on first use, with row-level security enabled and no policies so that only the server can read or write it.
- In development only, when `DATABASE_URL` is not set, a JSON file at `.data/media-details.json` is used instead. This fallback is not used in production.

Saving details requires a wallet signature from the owner. The signed message binds the file name and a hash of the new details, and the server checks that:

1. The request is fresh (within 5 minutes).
2. The signed text contains the expected message.
3. The public key controls the owner address.
4. The signature is valid.

After a file is deleted from Shelby, `/api/media-details/cleanup` removes its saved details, but only once the server has confirmed the file is gone.

---

## Object Queries

The application contains Shelby API routes for querying stored information:

- `/api/shelby/asset`
- `/api/shelby/assets` (takes a wallet address)
- `/api/shelby/object`
- `/api/shelby/locations`

The StorageContext loads the connected wallet's assets from `/api/shelby/assets`. Explorer, Assets, Raw Storage, and the dashboard read from that context.

---

## Storage and Explorer

Explorer is a user-facing interface over the connected wallet's stored assets. It supports:

- Asset search
- Status filtering (`Stored`, `Failed`)
- Sorting: newest, oldest, name, largest, smallest
- Asset inspection
- Empty states

Explorer shows no wallet-specific assets while no wallet is connected.

A small per-wallet activity history is also kept in the browser's `localStorage`. It is supplementary interface state; a `localStorage` failure never breaks a storage operation.

---

## Server-Side Credentials

Server-side Shelby credentials are used only from server-side code:

- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

These values must remain private. They must never be placed in `NEXT_PUBLIC_*` variables, and must never be committed to the Git repository. The application's `.gitignore` excludes `.env*` files (except `.env.example`).

The browser upload uses a separate, browser-visible key, `NEXT_PUBLIC_SHELBY_BROWSER_API_KEY`, to call the Shelby RPC directly. Anything in a `NEXT_PUBLIC_*` variable is visible to every visitor and should be treated as public.

---

## Storage Security Boundary

```text
PUBLIC / BROWSER
│
├── File selection
├── Upload interface
├── Wallet interaction (signing)
├── Progress display
└── Direct chunkset transfer to Shelby RPC
          │
          │
      SERVER BOUNDARY
          │
          ▼
PRIVATE / SERVER
│
├── Protected credentials
├── Transaction payload preparation
├── Public media serving
└── Database access
```

This boundary allows browser-direct storage without exposing protected server configuration.

---

## Failure Handling

Storage operations can fail at different stages:

- Commitment generation
- Upload preparation
- Wallet authorization
- Chunkset transfer (including timeouts, which are retried)
- Missing storage provider acknowledgements
- Transaction submission
- Finalization

The upload throws a message naming the stage that failed, for example which chunkset was rejected or that the wallet transaction failed, rather than a generic upload error.

---

## Current Limitations

- Library details are only saved when Postgres is configured (or in development with the JSON fallback).
- Asset lists are loaded from Shelby per connected wallet. There is no global index of Shelby assets and no background indexing.
- The activity history is stored in the browser only and is not synchronized between devices.
- The server-side streaming upload route exists but is not used by the browser upload path.

---

## Design Principles

**Keep Large Data Off the Application Server**
Browser-direct upload avoids routing file payloads through Next.js.

**Keep User Authorization With the User**
Registering, committing, and deleting are wallet-signed. Owner-only saves of Library details require a wallet-signed message.

**Protect Server Credentials**
Server-side credentials stay behind the server boundary.

**Be Strict About What Is Served**
The public media route serves an allow-list of media types and applies restrictive headers.

**Adapt to the Connection**
Chunkset uploads run in parallel but slow down and retry when a connection cannot keep up.

**Keep Storage Modular**
Shelby-specific infrastructure is kept separate from UI components.

---

## Summary

The Shelby Studio storage engine connects the application to Shelby decentralized storage.

Files are uploaded from the browser directly to Shelby in parallel chunksets, with two wallet-signed transactions (register and finalize) around the transfer. Deleting a file is also a wallet-signed transaction. Library media is served through a Range-capable route with a strict type allow-list, and Library titles, descriptions, and covers are stored in Postgres and changed only with a wallet signature from the owner.

The architecture keeps wallet authorization with the user and protected Shelby credentials on the server.
