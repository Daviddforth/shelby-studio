# Architecture

Shelby Studio is one Next.js application. The browser holds the user interface and the wallet connection. The server holds credentials and a small set of API routes. Files go to Shelby, small records go to Postgres, and live video goes through LiveKit.

---

## Overview

```text
                         Browser
        (UI, wallet, uploads, live camera)
                            |
        +-------------------+--------------------+
        |                   |                    |
        v                   v                    v
  Shelby RPC          Next.js server        LiveKit Cloud
  (file bytes)        (API routes)          (live video, chat)
        |                   |
        v                   +--> Postgres  (titles, descriptions, covers)
  Shelby storage            +--> Shelby / Aptos  (reads, transaction payloads)
```

| Part | Responsibility |
|---|---|
| Browser | Pages, wallet prompts, upload preparation, sending file pieces to Shelby, camera and microphone for Go Live. |
| Next.js server | Holds secrets, builds transaction payloads, verifies wallet signatures, serves media, issues live tokens. |
| Shelby | Stores the files. |
| Aptos | Records file registration and commitment transactions signed by the user's wallet. |
| Postgres | Stores titles, descriptions and cover references. |
| LiveKit | Carries live video, audio and chat. |

---

## Code layout

```text
app/
├── dashboard, library, live,
│   storage, explorer, developer, docs, profile ...   (workspace pages)
├── c/[owner]            public creator page
├── m/[owner]/[...name]  public media page
├── embed/[owner]/...    embeddable player
├── live/[owner]         public live page
└── api/
    ├── media/...        media streaming (Range, ETag)
    ├── media-details    titles, descriptions, covers
    ├── live/...         start, status, token, end
    ├── storage/...      prepare-upload, stream-upload, finalize-upload, upload
    └── shelby/...       assets, asset, object, download, locations, delete
components/   UI by area (media, live, layout, storage, ...)
context/      Wallet, Storage, Activity, Live session providers
hooks/        useStorage, useAssets, useWalletData ...
lib/
├── media/    types, server helpers, database, wallet-signature checks
├── live/     types and LiveKit server helpers
└── services/ Shelby upload and delete logic, runPool
docs/         the markdown pages you are reading
```

---

## Wallet

The wallet is the account. Three kinds of wallet interaction are used:

| Kind | Used for | Cost |
|---|---|---|
| Transaction | Upload (register and commit) and delete | Gas |
| Signed message | Saving media details, starting a live | Free, nothing sent to the chain |
| Connect | Showing your own data | Free |

### Signed-message checks

For saving details and starting a live, the server:

1. Rebuilds the exact message it expects for that action.
2. Requires the signed text to contain that message. For details, the message includes a hash of the new title, description and cover. For a live, it includes the title.
3. Checks the signature was made within a short window (5 minutes for details, 2 minutes for live).
4. Verifies the Ed25519 signature, and that the public key really controls the claimed owner address. Standard and single-key Aptos accounts are both supported.

Any mismatch is rejected with a 401.

---

## Uploads

File bytes go from the browser straight to Shelby, not through the Next.js server.

```text
1. Browser reads the file and builds commitments (Merkle roots) with the Shelby SDK
2. Server builds the registration payload      (no signing)
3. Wallet signs and submits the registration transaction
4. Browser sends chunksets to Shelby RPC, with a wallet-signed auth challenge
5. Server builds the commit payload from the storage provider acknowledgements
6. Wallet signs and submits the commit transaction
```

Step 4 sends up to 4 chunksets at once. After a failure it halves the number in flight, retries up to 6 times, and grows back after a run of successes. See [Upload Pipeline](/docs/upload-pipeline).

---

## Media serving

`/api/media/<owner>/<file>` reads from Shelby and streams the bytes:

- Only allow-listed video, audio and image types are served.
- HTTP range requests give `206`; unsatisfiable ranges give `416`.
- `ETag` and `If-None-Match` give `304`.
- A restrictive content security policy is sent on every response.

The public pages `/m/...` and `/embed/...` use this route and add titles from Postgres. See [Public Pages & Embeds](/docs/public-pages-embeds).

---

## Media details store

Titles, descriptions and covers live in one Postgres table.

- The table is created on first use and has Row Level Security enabled, so a public database API cannot edit it.
- In development without `DATABASE_URL`, a JSON file under `.data/` is used.
- In production without `DATABASE_URL`, saving is refused.

---

## Live streaming

```text
Host browser --(wallet signature)--> /api/live/start --> LiveKit room live-<owner>
Host browser <-- host token --------/
Viewer browser --> /api/live/token (only while host is present) --> viewer token
Host and viewers connect to LiveKit directly for video, audio and chat.
```

- One room per wallet address. Rooms close shortly after the host leaves.
- Host tokens can publish camera, microphone and screen. Viewer tokens can only subscribe and send chat data.
- Only the host token can call `/api/live/end`.
- Status is read from LiveKit, and a creator counts as live only while their host connection is in the room.

See [Go Live](/docs/live-streaming).

---

## State

| State | Where it lives |
|---|---|
| Connected wallet | Wallet provider in the browser |
| File list and uploads | Storage context, backed by Shelby |
| Profile name and picture | Browser local storage |
| Titles, descriptions, covers | Postgres |
| Live status and chat | LiveKit, in memory only |

---

## Security boundary

| Browser can see | Server only |
|---|---|
| `NEXT_PUBLIC_*` keys (restricted client keys) | `SHELBY_API_KEY`, `SHELBY_SIGNER_PRIVATE_KEY` |
| Public pages and public APIs | `DATABASE_URL`, `LIVEKIT_API_SECRET` |
| Tokens issued to that user | Signature verification, token signing |

Other protections: no HTML or SVG is served as media, wallet-signed saves are bound to the exact change, live endpoints are rate limited, and deleting a file needs the owner's wallet.

---

## Current limitations

- Activity history is saved in the browser only.
- Rate limits are per server instance and kept in memory.
- Live streams are not recorded.
- The real LiveKit and Shelby paths depend on external services being configured.

See [Limitations & Roadmap](/docs/limitations-roadmap).
