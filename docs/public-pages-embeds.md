# Public Pages & Embeds

Hosted media can be opened and embedded by anyone, without a wallet.

## URLs

| URL | What it is |
|---|---|
| `/c/<wallet>` | Creator page: all hosted media for a wallet, plus a LIVE NOW banner while that creator streams. |
| `/m/<wallet>/<file>` | Media page: a player with the title, description and cover. |
| `/embed/<wallet>/<file>` | Minimal player meant for an `<iframe>`. |
| `/api/media/<wallet>/<file>` | The media bytes themselves, for players and developers. |
| `/live/<wallet>` | Watch a live stream. See [Go Live](/docs/live-streaming). |

`<wallet>` is the Aptos address of the creator. `<file>` is the file's name in Shelby, which can include folders.

## Embedding

Copy the embed code from the Library. It looks like this:

```html
<iframe src="https://your-site/embed/0xYOUR_ADDRESS/clip.mp4"
        width="640" height="360" frameborder="0"
        allow="fullscreen" allowfullscreen loading="lazy"></iframe>
```

Audio embeds use a shorter height (96).

## How files are served

The media route reads directly from Shelby and streams the file:

- **Range requests.** Browsers can seek inside a video or audio file. A `Range: bytes=...` request returns `206 Partial Content`. An impossible range returns `416`.
- **Caching.** Responses carry an `ETag`, and a matching `If-None-Match` returns `304`.
- **Content type.** The type is taken from the file extension and only the allow-listed formats in [Library](/docs/library) are served.
- **Safety headers.** Media responses are sent with a `Content-Security-Policy: default-src 'none'; sandbox` header so a file cannot run scripts in the browser.
- **Cross-origin reads.** The route answers CORS preflights for `Range` and `If-None-Match`, so players on other sites can fetch media.

## Titles and covers

Titles, descriptions and covers come from the database. If a file has no saved details, pages fall back to the file name.

`GET /api/media-details?owner=<wallet>` returns the saved details for a creator and is public. Saving uses `PUT` and needs a valid wallet signature, so it cannot be done by anyone but the owner.

## Social previews

Media and creator pages set page titles and descriptions, and the site has a Shelby Studio preview image, so shared links show a card on most social sites.

## Creator profile

Open **Profile** in the app to set a display name, bio, website, X handle, GitHub username and a profile picture. Saving asks your wallet to sign a free message (nothing goes on-chain), so only you can change your profile. Your public page `/c/<wallet>` then shows the name, picture, bio and links, and a red ring with a LIVE badge while you stream.

- The picture must be an image already in your Library, so it is stored on Shelby.
- The X handle is shown as typed. It is not verified.
- Profiles are stored in the same database as media details (table `creator_profiles`, created automatically).
