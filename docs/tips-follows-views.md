# Tips, Follows and Views

Creators on Shelby Studio can get paid, grow an audience and see who is watching, with no account and no platform fee. This page explains how each part works and what it does not do.

## Tips

A **Tip** button appears on every creator page and media page (not on your own).

1. The fan picks an amount (0.1, 0.5 or 1 APT, or a custom amount, minimum 0.01 APT).
2. The fan's wallet sends APT straight to the creator's wallet with `0x1::aptos_account::transfer`.
3. Shelby Studio never holds the money and takes no cut.
4. After the transaction is confirmed, the page sends the transaction hash to the server. The server **looks the transfer up on the network** and checks that it is a successful transfer to that creator. Only then is the tip listed under **Supporters**. A fan cannot invent a tip, and the amount and sender shown come from the network.

Shelbynet uses test tokens, which have no market value. The Tip window says so.

If the transfer succeeded but the server could not find it yet, the fan sees a message saying the money was sent but is not on the supporters list yet.

## Follow

The **Follow** button needs one free wallet signature. Nothing goes on-chain and it costs no gas. The signed message names the creator, the action (follow or unfollow) and the time, and the server checks the signature before saving. You cannot follow yourself. The follower count is shown next to the button. On **Discover**, a "Creators you follow" row shows the people you follow, with anyone who is live first. Click a live one to watch.

## Live alerts

When you follow creators and press **Alert me when they go live** on Discover, your browser asks for permission and you sign one free message. From then on, when a creator you follow starts a new stream, your browser shows a notification, even if Shelby Studio is closed. Tap it to watch.

### Telegram alerts

If the server has a Telegram bot, a **Get alerts on Telegram** button also appears. It opens a one-time link to the bot (valid 15 minutes). Press Start in Telegram and your wallet is connected. The bot then messages you when a creator you follow goes live or schedules a stream. Send `/stop` to the bot, or press the button again, to turn it off. Alerts only go to private chats.

- Alerts are per browser. Turn them on in each browser you use.
- A creator notifies followers at most once every 10 minutes, so restarting a stream does not spam anyone.
- Reopening your studio while already live does not send alerts again.
- Alerts need `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT` on the server. Run `npm run vapid` to make a key pair. Without them the button is hidden.
- iPhone and iPad only deliver alerts after the site is added to the Home Screen.

## Views

Each creator page and media page counts one view per visitor per day. Visitors are told apart by a hash of their network address, so the raw address is not stored. Obvious bots are ignored. Media pages show a view count, the creator page shows the count on each file, and your Library cards show them too.

## Support card for your own website

On your own creator page, owners see a snippet to paste on any website. It shows your picture, followers and a LIVE badge. Its buttons open your Shelby Studio page, because wallets cannot work inside another site's page.

## Your audience

When your wallet is connected, the Home page shows a second row with views and plays, watch time, followers, tips and sales (with the APT for each). These are the same numbers visitors see.

## Where the data lives

Tips, follows and views are stored in your Postgres database (tables `tips`, `follows` and `page_views`). In local development they fall back to a file in `.data/`. In production without `DATABASE_URL`, writes are refused and public pages show zeros.

## Limits

- Tips use APT on the network the app is configured for. Tips in ShelbyUSD are not built.
- Alerts are browser and Telegram notifications. There is no email.
- Views are counted per visitor per day, so they are an estimate, not an exact audience.
- Tips are public by design. There is no anonymous tipping.
