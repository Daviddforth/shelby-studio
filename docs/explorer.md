# Explorer

The Explorer (`/explorer`) is a public, read-only view of the blobs stored under any Shelby account. Enter an account address and it lists that account's discoverable blobs. No wallet connection is required.

Managing your own files (replace, delete, share) happens in **Assets** (`/assets`), not in the Explorer.

---

# Contents

1. Overview
2. Current Features
3. Architecture
4. Explorer and Assets
5. Limitations
6. Related Documentation

---

# Overview

The Explorer looks up an account address on Shelbynet and shows the blobs the Shelby coordination layer returns for it. If a wallet is connected, the page fills in the wallet address automatically, and an "Explore connected wallet" link switches back to it after you look up another address.

---

# Current Features

### Account Lookup

Enter a Shelby account address (`0x...`) and select **Explore Account**, or press Enter.

---

### Asset Listing

Lists the blobs returned for the account, with a count of how many were found.

---

### Search

Filters the list by blob name, using case-insensitive matching.

---

### Status Filter

Filters by All Status, Stored, Failed or Pending.

---

### Sorting

Sorts by Newest, Oldest, Name, Largest or Smallest.

---

### Row Actions

Each blob row has:

- **Details** - opens a panel with the blob's information, with copy buttons for the UID, owner address and blob name, and a Download button.
- **Shelby Explorer** - opens the account on the external Shelby Explorer.
- **Download** - downloads the blob through `/api/shelby/download`.

---

# Architecture

```text
app/explorer/page.tsx
components/explorer/
├── AssetDetails.tsx
├── AssetRow.tsx
├── AssetTable.tsx
├── ExplorerHeader.tsx
└── SearchBar.tsx
```

```text
Explorer page
     │
     ▼
GET /api/shelby/assets?walletAddress=<address>
     │
     ▼
Shelby SDK / Shelbynet
```

`AssetTable` fetches the list for the active address. Search, status filtering and sorting are applied in the browser on the returned list.

---

# Explorer and Assets

| | Explorer | Assets |
| --- | --- | --- |
| Account | Any address you enter | The connected wallet |
| Wallet required | No | Yes |
| Actions | View, search, filter, sort, details, download | View, download, replace, delete |
| Extras | Link to the external Shelby Explorer | Stat cards and a History tab |

---

# Limitations

The Explorer does not currently provide:

- Replace or delete (use Assets for your own files)
- Image thumbnails or a preview modal
- Pagination
- Multi-select or batch actions
- Object version history

---

# Related Documentation

- Introduction
- Philosophy
- Architecture
- Storage Engine
- Upload Pipeline
- Engineering Decisions

---

## Summary

The Explorer is a read-only lookup for the blobs stored under a Shelby account. It lists, searches, filters, sorts and downloads. Changes to your own files are made in Assets.

---
