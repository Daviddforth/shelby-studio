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

## Views

Each creator page and media page counts one view per visitor per day. Visitors are told apart by a hash of their network address, so the raw address is not stored. Obvious bots are ignored. Media pages show a view count, the creator page shows the count on each file, and your Library cards show them too.

## Your audience

When your wallet is connected, the Home page shows a second row with your page and file views, followers, tips received and the total tipped in APT. These are the same numbers visitors see.

## Where the data lives

Tips, follows and views are stored in your Postgres database (tables `tips`, `follows` and `page_views`). In local development they fall back to a file in `.data/`. In production without `DATABASE_URL`, writes are refused and public pages show zeros.

## Limits

- Tips use APT on the network the app is configured for. Tips in ShelbyUSD are not built.
- Followers are not notified when you go live yet.
- Views are counted per visitor per day, so they are an estimate, not an exact audience.
- Tips are public by design. There is no anonymous tipping.
