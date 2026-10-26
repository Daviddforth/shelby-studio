# Paid Files

A creator can sell a video, audio file or image. The fan pays in APT straight to the creator's wallet, with no platform fee, and then watches or listens. This page explains how it works and, just as important, who has to be trusted.

## How it works

1. **Lock.** In the Library, under **Sell a file**, pick a file and a price. Your browser locks (encrypts) the file with a new random key using AES-256-GCM. The file never leaves your computer unlocked.
2. **Save the key.** You sign one free message. Shelby Studio saves the key, sealed with a secret that only the server knows. What you sign includes a fingerprint of the key, so it cannot be swapped on the way.
3. **Upload.** The locked file is uploaded to Shelby like any other upload. Anyone can download that public copy, but without the key it is unreadable noise.
4. **Pay.** On the file's page a fan presses **Unlock for X APT**. Their wallet sends the payment directly to you.
5. **Verify.** The server asks the network about the transaction. It must be a successful transfer from the fan's wallet to you for at least the price. A transaction can unlock only one file, once.
6. **Play.** The server gives the key to that wallet. The fan's browser downloads the locked file, unlocks it in memory and plays it. If the fan comes back later, one free signature is enough. No second payment.

You, the owner, can always open your own paid files.

## What is protected, and what is not

- The public copy on Shelby is encrypted. People without the key cannot watch it.
- Link previews, Discover and the embed player never show a paid file's content. A paid file in an embed shows a card that links to its page.
- **You have to trust this server.** It keeps the keys. Someone who controls the server and its `PREMIUM_KEY_SECRET` could open paid files. If you self-host, you are that someone.
- A fan who has paid can save the unlocked file and share it. No website can stop that.
- If you lose access to the server's database, the keys are lost and the locked files cannot be opened. Back up your database.

## Limits

- Files up to 200 MB. They are locked and unlocked in the browser's memory.
- Video, audio and images only, for now.
- Prices from 0.01 to 1,000 APT. Shelbynet uses test tokens, which have no market value.
- Payments are in APT. ShelbyUSD is not supported yet.
- There are no refunds. The payment goes straight to the creator.
- Paid files need `PREMIUM_KEY_SECRET` on the server (at least 16 random characters). Without it the **Sell a file** section says it is switched off.

Sales and the total earned show on your Home page.
