# Self-Hosting Setup

How to run your own copy of Shelby Studio, locally or on a host such as Vercel.

## Requirements

- Node.js 20.9 or newer and npm (required by Next.js 16)
- A Shelby API key and a Shelby signer key
- A Postgres database (optional for local development, required in production to save titles and covers)
- A LiveKit project (only if you want Go Live)

## Install

```bash
git clone https://github.com/Daviddforth/shelby-studio.git
cd shelby-studio
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Restart `npm run dev` after any change to `.env.local`.

## Environment variables

Never commit `.env.local`, and never paste its values into chat, screenshots or issues.

| Variable | Needed for | Notes |
|---|---|---|
| `SHELBY_API_KEY` | Server-side Shelby reads | Server only. |
| `SHELBY_SIGNER_PRIVATE_KEY` | Server-side Shelby operations | Server only. Treat as a secret. |
| `NEXT_PUBLIC_APTOS_API_KEY` | Browser Aptos requests | Visible in the browser. Use a restricted client key. |
| `NEXT_PUBLIC_SHELBY_BROWSER_API_KEY` | Browser uploads | Visible in the browser. Use a restricted client key. |
| `DATABASE_URL` | Titles, descriptions, covers | Any Postgres. The table is created automatically. |
| `DATABASE_CA_CERT` | Optional | Your provider's CA certificate (PEM, newlines as `\n`) for full certificate checking. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Public site URL used in share links and previews. |
| `LIVEKIT_URL` | Go Live | Starts with `wss://`. |
| `LIVEKIT_API_KEY` | Go Live | From your LiveKit project's Keys page. |
| `LIVEKIT_API_SECRET` | Go Live | Secret. Server only. |
| `LIVE_MAX_PARTICIPANTS` | Optional | Maximum people in one live room. Default 100. |
| `ADMIN_WALLET_ADDRESS` | Reports | The one wallet allowed to read reports at `/admin/reports`. Without it the page cannot be used. |

Variables beginning with `NEXT_PUBLIC_` are sent to every visitor's browser. Everything else stays on the server.

## Database

Titles, descriptions and covers are stored in one table in Postgres. Any provider works, for example Neon or Supabase.

1. Create a database and copy its connection string.
2. Set it as `DATABASE_URL`. If the string ends with `&channel_binding=require`, remove that part.
3. Start the app. The table is created on first use.

Notes:

- With Supabase, the table has Row Level Security turned on, so the public API cannot edit it.
- Without `DATABASE_URL` in development, details are kept in `.data/media-details.json`.
- Without `DATABASE_URL` in production, saving is refused and public pages show file names only.

## LiveKit

1. Create a free project at [LiveKit Cloud](https://cloud.livekit.io).
2. Open **Settings → Keys** and create a key.
3. Set `LIVEKIT_URL`, `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`.
4. Restart the app and open `/live`.

If a key is ever exposed, create a new one, update your settings and delete the old key.

## Deploying on Vercel

1. Import the repository.
2. Add the variables above in **Settings → Environment Variables**.
3. Production deploys from the `main` branch.
4. After changing variables, redeploy so the new values are used.

## Checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Live streaming is not set up on this server yet" | The three `LIVEKIT_` variables are missing, or the app was not restarted or redeployed. |
| Titles do not save | `DATABASE_URL` is missing or wrong, or the wallet did not sign. |
| Upload fails with a 408 timeout | Your connection is too slow for the current piece size. The uploader retries and slows down, but very slow connections can still fail. |
| Pages show serif text | An old build. Update to the latest version. |
