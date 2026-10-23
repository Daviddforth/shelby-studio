# Limitations & Roadmap

This page lists what works today, what does not, and what is planned. Nothing here is a promise of dates.

## What works today

| Area | Status |
|---|---|
| Library: upload video, audio and images | Available |
| Titles, descriptions and cover pictures (wallet-signed, saved in Postgres) | Available |
| Public media page, embed code and creator page | Available |
| Streaming with seek support (HTTP range) | Available |
| Go Live with chat (needs LiveKit) | Available |
| LIVE NOW banner on the creator page | Available |
| Raw Storage for any file type | Available |
| Assets view with real counts | Available |
| Explorer: look up files by wallet address | Available |
| Collection Builder and Metadata generator | Available |
| Developer playground, SDK examples and code generator | Available |

## Known limitations

### Uploads

- Upload time depends on your internet speed. A multi-gigabyte file takes a long time on a slow connection, whatever the software does.
- Shelby closes a request that takes more than 60 seconds. Pieces are about 9 to 10 MB, so connections slower than roughly 1.5 Mbps may fail even with retries. The uploader sends several pieces at once and slows down after a timeout.
- The browser has to read the whole file and prepare it before sending the first byte, which takes time on large files.
- Uploading and deleting need wallet approval and gas.

### Library

- Only the listed video, audio and image formats get public pages. Other files can be stored in Raw Storage.
- There is no transcoding. A file plays only if the viewer's browser supports its format.
- Without a configured database, titles and covers cannot be saved.

### Go Live

- Streams are not recorded and not saved to Shelby.
- Chat has no moderation tools and is not stored.
- There is no page that lists who is live.
- Rate limits are kept in memory per server instance.
- LiveKit's own plan limits apply, such as monthly participant-minutes.

### Profiles

- Profile names and pictures are saved in the browser only. They are not shown on public pages yet.
- There is no verified link to social accounts yet.

### General

- Shelby Studio depends on the Shelby network and on the services it is configured with.
- The AI Tools page is hidden from the menu until it is connected to a real model.
- Some wallets may not support message signing, which Library edits and Go Live need.

## What Shelby Studio does not claim

- No fixed storage quota.
- No performance statistics that have not been measured.
- No uptime guarantee.

## Roadmap

Ideas, roughly in the order they are being considered:

1. Creator profile pages stored in the database (name, picture, bio), with an optional verified social link.
2. Live replays: record a stream and save it to the Library on Shelby.
3. A Discover page showing who is live and new uploads.
4. Chat moderation for hosts.
5. Tips or paid access using Aptos.
6. A list of past collections, and a Library that accepts every file type.

## Next

Start with [Quick Start](/docs/quick-start) or read [Architecture](/docs/architecture).
