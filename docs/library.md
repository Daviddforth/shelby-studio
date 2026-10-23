# Library

The Library is where creators manage their videos, audio and images. Every file gets a public page and an embed code, and all of them appear on the creator's public page.

Open it from **Library** in the side menu. The Library has no upload box of its own: it has an **Upload** button that takes you to the Upload page, so there is one place to upload.

## Uploading

Open **Upload** in the side menu, then drag a file into the upload box or click it to choose one. Any file type can be uploaded, and videos, audio and images then appear in the Library. After an upload finishes, **View in Library** takes you there. The upload runs in your browser:

1. The browser reads the file and prepares it for Shelby.
2. Your wallet approves a transaction that registers the file.
3. The file is sent to Shelby in pieces.
4. Your wallet approves a second transaction that commits the file.

Both transactions cost gas. The pieces are sent several at a time, and Shelby Studio slows down automatically when your connection is slow. Upload time depends mostly on your own upload speed. See [Upload Pipeline](/docs/upload-pipeline).

## Supported formats

| Kind | Extensions |
|---|---|
| Video | mp4, m4v, webm, mov, ogv |
| Audio | mp3, wav, m4a, aac, ogg, oga, opus, flac |
| Images | jpg, jpeg, png, gif, webp, avif |

Other file types can be uploaded on the **Upload** page, but they do not get a public page or embed. SVG images are deliberately not supported, because an SVG can contain scripts.

## Details

Choose **Edit details** on a file to set:

| Field | Limit |
|---|---|
| Title | 120 characters |
| Description | 2,000 characters |
| Cover picture | any image already in your Library |

When you save, your wallet signs a short message. The signature proves you own the file and is bound to the exact new title, description and cover, so it cannot be reused for a different edit. It is free and sends nothing to the chain.

Details are stored in a Postgres database. If no database is configured, public pages still work but show file names only. See [Self-Hosting Setup](/docs/self-hosting).

Images that you use as a cover are marked "Used as a cover" and are not listed separately on your public page.

## Share links and embeds

Each file has:

- **Link:** the public page, `/m/<wallet>/<file>`.
- **Embed:** an `<iframe>` snippet for your own site.
- **Open:** shows the public page.

Details are in [Public Pages & Embeds](/docs/public-pages-embeds).

## Deleting

**Delete** asks for confirmation and then a wallet transaction. It removes the file from Shelby for good. Only the wallet that owns the file can delete it.

## Filters

The filter chips (All, Video, Audio, Images) show how many files you have of each kind.
