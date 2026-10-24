# Go Live

Go Live lets a creator stream from a browser and share one link. Viewers open the link, watch and chat. No viewer account is needed.

Live video runs on [LiveKit](https://livekit.io). Shelby is a storage network, so the live video itself does not go through Shelby.

## For creators

1. Connect your wallet.
2. Click the red **Go live** button in the top bar, or open **Go Live** in the side menu.
3. Type a title (up to 100 characters) and click **Go live**.
4. Your wallet asks for a free signature. It proves you own the address and is tied to your title. It expires after two minutes.
5. Allow camera and microphone access.
6. Copy the link under **Send this link to people**. It looks like `/live/<random code>`. The code is new for every live and does not contain your wallet address. It stops working when you end the live.

While live you can turn the camera and microphone on or off, share your screen, watch the viewer count and read and send chat. Click **End live** to stop.

Your link is always the same, so you can put it in a social profile. It shows "Not live right now" until you start. A viewer waiting on that page sees it switch to "Live now" by itself when you go live, and then clicks **Watch live**.

Your creator page (`/c/<wallet>`) shows a **LIVE NOW** banner while you stream.

## For viewers

Open the link, optionally type a name for chat, and click **Watch live**. If the sound is blocked by the browser, tap **Tap to enable sound**. When the host ends the stream, the page says so. If the creator comes back, the page offers **Watch live** again.

## Chat

Chat travels over the live connection and is not stored. Messages are up to 300 characters, and names are up to 30. A viewer's name comes from the token the server issued to them, so a message cannot pretend to be someone else or claim to be the host.

### Moderation

Viewers send their messages to the host only. The host's browser checks each one and then passes the accepted ones on to everybody, so the host stays in control while the studio is open (also when you are on another page).

- **Blocked words:** open **Moderation** above the chat and type words separated by commas. Messages containing them are not shown, and the sender is told. Case, accents and punctuation are ignored.
- **Mute:** the speaker icon next to a message silences that viewer for the rest of the live.
- **Remove and block:** the red icon removes the viewer and stops the same network from rejoining this live. Someone on a shared network (an office, for example) or using a VPN can differ, so it is a deterrent, not a guarantee.
- Slow down: a viewer can send at most one message every 0.7 seconds.

## Replays

Your live is recorded in your own browser while you stream. After **End live**, the studio page offers **Save your replay to Shelby**: pick **Save**, approve the upload in your wallet like any other upload, and the video appears in your Library with a share link. Nothing is recorded on a server, so there is no extra recording cost.

- The recording is cut into parts: a new part starts every 30 minutes and whenever you switch between camera and screen.
- Replays are saved as WebM, so they need Chrome, Edge or Firefox. Safari can host a live but cannot record one.
- The replay exists only in the browser tab until you save it. If you close the tab first, it is lost. You can also download a copy.
- LiveKit's own recording is not used: the free plan includes only 60 minutes of it per month.

## Security

- Only the wallet that signed the start request can broadcast on a stream. The server checks the wallet's signature before it opens a room.
- Viewers get tokens that can watch, listen and chat, but not publish video or audio.
- Only the host's token can end a stream.
- Viewers can only join while the host is connected.
- Requests are rate limited per IP address.

## API

| Route | Who | What |
|---|---|---|
| `POST /api/live/start` | Owner (wallet signature) | Opens the room and returns the LiveKit URL and a host token. |
| `GET /api/live/status?ref=` | Public | Is this stream live (ref = the link code, or a wallet address), the title, and the viewer count. |
| `POST /api/live/token` | Public | Returns a watch-only token while the host is live. |
| `POST /api/live/end` | Host (`Authorization: Bearer <host token>`) | Ends the stream. |
| `POST /api/live/remove` | Host (`Authorization: Bearer <host token>`) | Removes one viewer and can block them from rejoining. |

## Setup

Go Live needs three environment variables, `LIVEKIT_URL`, `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`. Without them the page shows "Live streaming is not set up on this server yet". See [Self-Hosting Setup](/docs/self-hosting).

`LIVE_MAX_PARTICIPANTS` optionally limits people in one room (default 100).

## Costs and limits

LiveKit bills by participant-minutes and bandwidth. At the time of writing, LiveKit Cloud's free plan includes 5,000 participant-minutes and 50 GB of downstream bandwidth per month, and stops at the limit instead of charging. For example, a one-hour stream with 10 viewers uses about 660 participant-minutes. Check LiveKit's pricing page for current numbers.

## Current limits

- Replays are recorded in the host's browser and are lost if the tab is closed before saving.
- One stream per wallet at a time. Starting again while live keeps the same link.
- The live runs in your browser tab. You can open other pages in the studio while live (a red bar lets you return or end it), but closing or reloading the tab ends it.
