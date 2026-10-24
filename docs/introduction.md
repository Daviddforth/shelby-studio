# Introduction

Shelby Studio is a creator workspace built on the Shelby decentralized storage protocol. Upload videos, audio and images, get a public page and an embed code for each one, and go live with a link anyone can open. Everything you upload is stored on Shelby and belongs to your wallet.

Shelby Studio is an independent project built around the Shelby ecosystem. It is not an official Shelby product.

---

## What you can do

| Area | What it does |
|---|---|
| **Upload** | The one place to upload. Any file type goes to Shelby, with progress. Videos, audio and images then appear in your Library. |
| **Library** | Your videos, audio and images. Add a title, description and cover picture. Copy a share link or an embed code. |
| **Go Live** | Start a live stream from your camera or screen. Send the link to anyone. They watch and chat in the browser, no account needed. |
| **My Page** | Your public creator page. It lists your hosted media and shows a LIVE NOW banner while you stream. |
| **Discover** | Who is live right now and the newest media creators chose to share, plus a public Stats page with real counts. |
| **Explorer** | Look up the files stored by any wallet address. |
| **Developer** | An API playground, SDK examples and a code generator for the Shelby Studio API. |

---

## Why Shelby

Most creator platforms keep your files on their servers. Shelby is a decentralized storage network designed for fast reads, which makes it a fit for streaming media. In Shelby Studio:

- Your wallet is your identity. There are no usernames or passwords.
- Uploading and deleting are transactions that your wallet signs, so only the owner can change a file.
- Public pages read straight from Shelby, so a link keeps working as long as the file is stored.

---

## The wallet

Connect an Aptos-compatible wallet to use Shelby Studio.

- **Without a wallet** you can browse the app in demo mode, open public creator pages, watch live streams and read these docs.
- **With a wallet** you can upload, edit details, delete files and go live.

Some actions ask your wallet for a **signature** that is free and sends nothing to the chain (saving a video's title, starting a live). Others, such as uploading and deleting, are **transactions** that the wallet approves and that cost gas.

---

## How it fits together

```text
Browser (wallet connected)
   |
   |-- upload ------------> Shelby storage  (wallet-signed transactions)
   |
   |-- titles, covers ----> Postgres        (wallet-signed messages)
   |
   |-- go live -----------> LiveKit         (video, audio, chat in real time)

Anyone with a link
   |
   |-- /m/<wallet>/<file>   public media page
   |-- /embed/...           embeddable player
   |-- /c/<wallet>          creator page
   |-- /live/<wallet>       watch a live stream
```

See [Architecture](/docs/architecture) for details.

---

## Where to go next

- [Quick Start](/docs/quick-start): upload a file and go live in a few minutes.
- [Library](/docs/library): hosting video, audio and images.
- [Go Live](/docs/live-streaming): streaming and what it needs.
- [Public Pages & Embeds](/docs/public-pages-embeds): links, embed codes and how files are served.
- [Self-Hosting Setup](/docs/self-hosting): environment variables, database and LiveKit.
- [Limitations & Roadmap](/docs/limitations-roadmap): what works today and what does not.
