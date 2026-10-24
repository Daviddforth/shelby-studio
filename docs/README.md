# Shelby Studio Documentation

Shelby Studio is a creator workspace built on the Shelby decentralized storage protocol. These pages describe what it does, how it works and how to run it. They are shown on the site at `/docs`.

The docs match the current code. Things that are not built yet are listed as limitations or roadmap items, never as features.

## Getting started

| Page | File |
|---|---|
| Introduction | [introduction.md](introduction.md) |
| Quick Start | [quick-start.md](quick-start.md) |
| Philosophy | [philosophy.md](philosophy.md) |
| Architecture | [architecture.md](architecture.md) |

## Creator tools

| Page | File |
|---|---|
| Library: upload video, audio and images | [library.md](library.md) |
| Go Live: stream and chat | [live-streaming.md](live-streaming.md) |
| Public Pages & Embeds | [public-pages-embeds.md](public-pages-embeds.md) |
| Dashboard and menu | [dashboard.md](dashboard.md) |

## Storage

| Page | File |
|---|---|
| Storage Engine | [storage-engine.md](storage-engine.md) |
| Upload Pipeline | [upload-pipeline.md](upload-pipeline.md) |
| Explorer | [explorer.md](explorer.md) |

## Developer

| Page | File |
|---|---|
| Developer Platform | [developer.md](developer.md) |
| Self-Hosting Setup | [self-hosting.md](self-hosting.md) |

## Engineering

| Page | File |
|---|---|
| Engineering Decisions | [engineering-decisions.md](engineering-decisions.md) |
| Limitations & Roadmap | [limitations-roadmap.md](limitations-roadmap.md) |

## Security model

- The browser holds only keys that are meant to be public (`NEXT_PUBLIC_` variables). Server credentials stay in server-side environment variables.
- Uploading and deleting are transactions signed by the user's own wallet. The server never signs them. The old server-signed upload and delete routes are disabled and return `410 Gone`.
- Saving a video's details and starting a live stream need a free wallet signature that is bound to the exact request and expires quickly.
- Public media is served with a strict content-type allow-list and a sandboxing `Content-Security-Policy`, so a stored file cannot run scripts.
- Live tokens are issued by the server: viewers can watch and chat but not publish, and only the host can end a stream.

## Updating the documentation

1. Change the Markdown file in `docs/`.
2. If you add a page, add it to the list in `app/docs/[slug]/page.tsx`, to `components/docs/DocsSidebar.tsx` and to the cards in `app/docs/page.tsx`.
3. Describe only what the code does today. Put anything else under Limitations & Roadmap.
4. Run `npm run build` to make sure every page renders.
