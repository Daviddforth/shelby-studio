# Quick Start

This page takes you from a new wallet to a hosted video, a shareable page and a live stream.

## For creators

### 1. Connect your wallet

Open the app and click **Connect Wallet** in the top bar. Use an Aptos-compatible wallet such as Petra. Your wallet address becomes your creator identity.

### 2. Upload

1. Open **Upload** in the side menu.
2. Drag a video, audio file or image into the upload box, or click it to choose a file.
3. Approve the wallet prompts. Uploading registers the file on Shelby and then commits it, so the wallet asks twice and pays a small gas fee.
4. Wait for the progress bar to finish. Large files take longer: the time is mostly your upload speed. When it is done, click **View in Library**.

Supported formats are listed in [Library](/docs/library).

### 3. Add details and share

Open **Library**. On any file:

- **Edit details** sets a title, a description and an optional cover picture. Saving asks your wallet for a free signature, so nobody else can change them.
- **Link** copies the public page for that file.
- **Embed** copies an `<iframe>` you can paste into your own site.
- **Open** shows the public page.

### 4. Share your creator page

Open **My Page** in the side menu. That page lists everything you host. Copy its link and put it in your social profile.

### 5. Go live

1. Click the red **Go live** button in the top bar.
2. Type a title and click **Go live**. Your wallet asks for a free signature.
3. Allow camera and microphone access in your browser.
4. Copy the link shown under **Send this link to people** and send it.

Viewers open the link, click **Watch live** and can chat with you. Click **End live** when you finish. Go Live needs LiveKit to be configured, see [Self-Hosting Setup](/docs/self-hosting).

## For developers

The Shelby Studio API exposes read operations for Shelby assets. Open **Developer** in the side menu to try them in the API Playground.

### List assets

```ts
const response = await fetch(`/api/shelby/assets?walletAddress=${encodeURIComponent(address)}`);

if (!response.ok) throw new Error("Failed to load Shelby assets");

const data = await response.json();
```

### Download an asset

```ts
const response = await fetch(
  `/api/shelby/download?owner=${encodeURIComponent(owner)}&blobName=${encodeURIComponent(blobName)}`
);

const file = await response.blob();
```

### Stream hosted media

Public media is served with HTTP range support, so players can seek:

```html
<video controls src="/api/media/<wallet>/<file name>"></video>
```

See [Public Pages & Embeds](/docs/public-pages-embeds) for the exact URLs.

### Uploading

Uploads are signed by the user's wallet in the browser, so they are not a plain API call. The flow is described in [Upload Pipeline](/docs/upload-pipeline).

## Security

Never put private credentials in client-side code. Shelby Studio keeps server credentials in server-side environment variables, and only keys that are meant to be public use the `NEXT_PUBLIC_` prefix.

## Next

- [Library](/docs/library)
- [Go Live](/docs/live-streaming)
- [Self-Hosting Setup](/docs/self-hosting) if you want to run your own copy
