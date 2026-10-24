# Philosophy

Shelby Studio is built around one idea:

> Creators should own their content and be able to share it with a link, without handing it to a platform.

Shelby provides the storage. Shelby Studio provides the creator tools on top: hosting, share pages, embeds and live streaming, with the wallet as the only account.

---

## Own your content

Files are stored on Shelby and registered to the creator's wallet. Uploading and deleting are transactions the creator signs. Shelby Studio's servers cannot delete a creator's files, and no one else can change them.

## The wallet is the account

There are no usernames, passwords or sign-up forms. A wallet address identifies a creator, and the same address is used in public links (`/c/<wallet>`, `/live/<wallet>`).

When an action only needs proof of ownership, such as saving a title or starting a live stream, the wallet signs a message instead of sending a transaction. The server checks that signature before it accepts anything. Each signed message is tied to the exact action, so a signature for one edit cannot be reused for another.

## Share by link

Everything a creator makes should be shareable with one link: a media page, an embed, a creator page or a live stream. Viewers never need an account or a wallet.

## Secrets stay on the server

Server credentials stay in server-side environment variables. Only keys that are meant to be public use the `NEXT_PUBLIC_` prefix. Files go from the browser straight to Shelby, so file bytes do not pass through Shelby Studio's server during upload.

## Safe by default

- Only an allow-list of video, audio and image formats is served. SVG is excluded because it can carry scripts.
- Media responses are sent with a restrictive content security policy.
- Public endpoints are rate limited.

## Honest about limits

Shelby Studio says what it does not do yet. See [Limitations & Roadmap](/docs/limitations-roadmap). It does not show invented statistics, storage quotas or performance numbers.

## Keep it simple

The app has few areas on purpose: Upload, Library, Go Live, My Page and a small "More" section. New features should fit one of those, or earn a new place.

## Independent project

Shelby Studio is an independent project built around the Shelby ecosystem. It is not an official Shelby product.
