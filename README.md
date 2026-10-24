# Shelby Studio

A creator workspace built on the Shelby decentralized storage protocol. Upload video, audio and images, get a public page and an embed code for each file, and go live with a link anyone can open. Everything you upload is stored on Shelby and belongs to your wallet.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Aptos](https://img.shields.io/badge/Aptos-Compatible-5A45FF)](https://aptos.dev/)
[![Shelby](https://img.shields.io/badge/Shelby-Storage-111827)](https://shelby.xyz/)

**Live site:** https://shelbystudio.xyz

> Shelby Studio is an independent project built around the Shelby ecosystem. It is not an official Shelby product.

---

## What you can do

| Area | What it does |
|---|---|
| **Upload** | The one place to upload. Any file type goes to Shelby, with progress. |
| **Library** | Your videos, audio and images. Add a title, description and cover picture. Copy a share link or an embed code. |
| **Go Live** | Stream from your camera or screen and send one link. Viewers watch and chat in the browser, with no account. |
| **My Page** | Your public creator page at `/c/<wallet>`. It lists your media and shows a LIVE NOW banner while you stream. |
| **NFT Tools** | Collection Builder, Metadata generator and an Assets view of everything stored with your wallet. |
| **Explorer** | Look up the files stored by any wallet address. |
| **Developer** | An API playground, SDK examples and a code generator. |
| **Docs** | Guides and reference at `/docs`. |

## How it works

```text
Browser (wallet connected)
   |-- upload ------------> Shelby storage   (wallet-signed transactions)
   |-- titles, covers ----> Postgres         (wallet-signed messages)
   |-- go live -----------> LiveKit          (real-time video, audio, chat)

Anyone with a link
   |-- /m/<wallet>/<file>    media page
   |-- /embed/<wallet>/<file> embeddable player
   |-- /c/<wallet>           creator page
   |-- /live/<code>          watch a live stream (random link)
```

- **Your wallet is your identity.** There are no usernames or passwords.
- **Uploading and deleting are signed by your wallet** in the browser, so only the owner can change a file. The server never signs uploads or deletes on anyone's behalf.
- **Saving details and starting a live use free wallet signatures** bound to the exact request, so they cannot be reused or changed.
- **Public pages read straight from Shelby**, with range requests so players can seek.
- **Live video runs on LiveKit.** Shelby is storage, so the live stream itself does not go through Shelby.

## Wallet and demo mode

Without a wallet you can browse the app in demo mode (clearly labeled sample data), open public creator pages, watch live streams and read the docs. Connect an Aptos-compatible wallet such as Petra to upload, edit, delete, create collections and go live.

## Quick start

You need Node.js 20.9 or newer, and a Shelby API key and signer key.

```bash
git clone https://github.com/Daviddforth/shelby-studio.git
cd shelby-studio
npm install
cp .env.example .env.local
npm run dev
```

Fill in `.env.local`, then open http://localhost:3000. Restart `npm run dev` after changing it.

### Environment variables

Never commit `.env.local` and never paste its values into chat, screenshots or issues.

| Variable | Needed for |
|---|---|
| `SHELBY_API_KEY` | Server-side Shelby reads (server only) |
| `SHELBY_SIGNER_PRIVATE_KEY` | Server-side Shelby lookups (server only, secret) |
| `NEXT_PUBLIC_APTOS_API_KEY` | Browser Aptos requests (public, use a restricted key) |
| `NEXT_PUBLIC_SHELBY_BROWSER_API_KEY` | Browser uploads (public, use a restricted key) |
| `DATABASE_URL` | Titles, descriptions and covers. Any Postgres. Required in production |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Go Live |
| `NEXT_PUBLIC_SITE_URL` | Optional: public URL used in share links |
| `LIVE_MAX_PARTICIPANTS` | Optional: people per live room (default 100) |

Full setup for the database, LiveKit and deployment is in [Self-Hosting Setup](docs/self-hosting.md).

### Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Project structure

```text
app/
  library/        Upload and manage video, audio, images
  live/           Go live (host) and /live/<code> (watch)
  c/ m/ embed/    Public creator page, media page, embeddable player
  storage/ assets/ explorer/ metadata/ collections/ developer/ docs/
  api/            media, media-details, live, shelby (read), storage (prepare/finalize)
components/       UI by area (media, live, layout, storage, ...)
lib/
  media/          Media lookups, wallet-signature checks, Postgres store
  live/           LiveKit tokens, status, rate limiting
  services/       Browser-direct upload to Shelby, runPool, delete
docs/             Documentation shown at /docs
```

## Documentation

Docs are in [`docs/`](docs/README.md) and are shown on the site at `/docs`.

- [Quick Start](docs/quick-start.md)
- [Library](docs/library.md)
- [Go Live](docs/live-streaming.md)
- [Public Pages & Embeds](docs/public-pages-embeds.md)
- [Self-Hosting Setup](docs/self-hosting.md)
- [Upload Pipeline](docs/upload-pipeline.md)
- [Limitations & Roadmap](docs/limitations-roadmap.md)

## Limitations

- Upload time depends on your internet speed. Shelby closes a request after 60 seconds, so very slow connections can fail even with retries.
- Streams are not recorded or saved to Shelby, and chat has no moderation.
- The X handle on a profile is not verified yet.
- Titles and covers need a configured database.

See [Limitations & Roadmap](docs/limitations-roadmap.md) for the full list and what is planned next.

## Contributing

Issues, feature requests and pull requests are welcome. Before opening a pull request:

- Keep changes focused.
- Run `npx tsc --noEmit`, `npm run lint` and `npm run build`.
- Never commit secrets or environment files.
- Describe what changed and why.

## License

MIT. See [LICENSE](LICENSE).

## Links

- Site: https://shelbystudio.xyz/
- GitHub: https://github.com/Daviddforth/shelby-studio
- X: https://x.com/ShelbyStudioHQ
- Shelby: https://shelby.xyz/ and https://docs.shelby.xyz/
