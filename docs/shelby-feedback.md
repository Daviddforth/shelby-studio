# Notes for the Shelby team

Shelby Studio is an unofficial creator workspace built on Shelby (https://shelbystudio.xyz). This note says what it does with Shelby, what worked well, and what would help the next builder. It only describes what was observed while building.

## What it does with Shelby

- Creators upload video, audio and images from the browser. The wallet signs the registration and commit transactions, so the creator pays and owns the file. Nothing is uploaded through a Shelby Studio server.
- Public pages, embeds and creator pages read files back from Shelby by owner address and blob name, with HTTP range support so players can seek.
- Every media page shows a "Stored on Shelby" panel (owner, blob name, size, commit time, etag) and links to the Shelby Explorer, so a visitor can check where the file lives.
- Live replays are recorded in the host's browser after a stream and uploaded to the host's own Shelby storage.
- Titles, descriptions, covers and profiles are small application data kept in Postgres, keyed by the wallet.

## What worked well

- Wallet-owned storage made the trust model simple: only the owner's wallet can add or delete a file, so the app never holds user data or keys.
- Reading a blob by `owner/blobName` made public pages and embeds easy.
- The SDK made direct browser uploads possible without a backend in the upload path.

## Problems and questions

1. **60 second request limit.** Shelby closes a request that takes longer than 60 seconds (HTTP 408). A chunkset is about 9 to 10 MB, so a connection slower than roughly 1.5 Mbps cannot finish one, and several parallel chunksets share the bandwidth and make it worse. Shelby Studio now starts with 4 parallel chunksets and halves that after a timeout. Question: is a smaller chunkset size, or a longer timeout for slow clients, planned or possible?
2. **Whole-file read before the first byte.** Commitments are generated from the whole file, so the browser reads and processes a multi-gigabyte file before anything is sent. Streaming commitment generation would make large uploads start much sooner.
3. **Upload speed expectations.** A 215 MB video took minutes on a home connection. What upload speed should builders promise their users?
4. **Durability and network resets.** Which guarantees apply on the current network, and what should an app tell its users about permanence and resets?
5. **Public read access.** What are the rate limits and API-key expectations for public reads (many viewers watching a shared video)?
6. **Official video streaming path.** Is there a recommended way to serve video (adaptive bitrate, CDN-style reads) that apps should use instead of range requests on blobs?

## Ideas

- A public "list recent blobs" endpoint (opt-in) would let apps build Discover pages without keeping their own index.
- A signed-URL or access-control option would allow paid or private media.
