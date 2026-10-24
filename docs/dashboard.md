# Dashboard

The Dashboard (**Home** in the side menu) is the starting page. It shows an overview of your workspace and shortcuts into the main areas.

Without a wallet it shows clearly labeled demo data. With a wallet connected it shows your own numbers.

## What is on the page

| Section | What it shows |
|---|---|
| **Hero** | A welcome, your profile name if you saved one, and your network. |
| **Statistics** | Files, videos, images and storage used for your wallet. |
| **Quick Actions** | Upload, Go Live, Library, Library and Share Your Page. |
| **Storage overview** | Files and total size for your wallet. |
| **Network status** | Wallet and network connection. |
| **Storage analytics** | A breakdown of what you store. |

"Share Your Page" opens your public creator page at `/c/<wallet>` once your wallet is connected.

## Menu

The side menu is shared by the whole app, and the phone menu uses the same list.

```text
Create        Home, Upload, Library, Go Live, My Page
More          Explorer, Developer, Documentation
```

The top bar has a red **Go live** button, search, the wallet button and your profile.

## Where the numbers come from

Asset counts and storage used are counted from the files returned for your wallet. Nothing is estimated, and storage used is the total size of your files, not an account quota.

## Components

```text
app/dashboard/page.tsx
components/dashboard/
├── DashboardHero.tsx
├── DashboardStats.tsx
├── QuickActions.tsx
├── NetworkStatus.tsx
├── StorageOverview.tsx
└── StorageAnalytics.tsx
```

## Current limitations

- Your profile name and picture are saved in your browser only, so they do not appear on public pages yet.
