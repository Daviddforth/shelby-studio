# Quick Start

Get from Shelby Studio to a working Shelby integration.

Shelby Studio provides a developer workspace for exploring Shelby storage, inspecting assets, testing API operations, and generating integration examples.

## 1. What You Need

Before starting, you should have:

- A Shelby Studio environment
- Access to the Shelby network you want to work with
- A wallet when an operation requires an on-chain transaction
- Your application environment ready to make HTTP requests

Read-only API exploration does not require you to connect a wallet.

## 2. Start With the Developer Workspace

Open the **Developer** workspace in Shelby Studio.

The Developer workspace provides:

- API Playground
- SDK Explorer
- Code Generator
- Integration examples

Use the API Playground to understand an operation before integrating it into your own application.

## 3. List Assets

The simplest way to begin is to retrieve available Shelby assets.

### Request

```ts
const response = await fetch("/api/shelby/assets");

if (!response.ok) {
  throw new Error("Failed to load Shelby assets");
}

const data = await response.json();

console.log(data);
```

This allows your application to inspect the assets returned by Shelby Studio.

## 4. Inspect an Asset

Once you have a blob name, you can request detailed information about that asset.

```ts
const blobName = "your-blob-name";

const response = await fetch(
  `/api/shelby/asset?blobName=${encodeURIComponent(blobName)}`
);

if (!response.ok) {
  throw new Error("Failed to inspect asset");
}

const asset = await response.json();

console.log(asset);
```

Use this when your application needs information about a specific Shelby object.

## 5. Inspect Full Object Metadata

For applications that need the underlying object information, use:

```ts
const blobName = "your-blob-name";

const response = await fetch(
  `/api/shelby/object?blobName=${encodeURIComponent(blobName)}`
);

if (!response.ok) {
  throw new Error("Failed to retrieve object metadata");
}

const object = await response.json();

console.log(object);
```

## 6. Download an Asset

To retrieve an existing Shelby asset:

```ts
const owner = "your-owner-address";
const blobName = "your-blob-name";

const response = await fetch(
  `/api/shelby/download?owner=${encodeURIComponent(owner)}&blobName=${encodeURIComponent(blobName)}`
);

if (!response.ok) {
  throw new Error("Failed to download asset");
}

const file = await response.blob();

console.log(file);
```

Your application can then create an object URL or otherwise process the returned file.

## 7. Explore Shelby Storage Locations

Shelby Studio also exposes storage location information:

```ts
const response = await fetch("/api/shelby/locations");

if (!response.ok) {
  throw new Error("Failed to load storage locations");
}

const locations = await response.json();

console.log(locations);
```

## 8. Uploading Files

Uploads are different from read-only API operations.

Shelby Studio's upload pipeline handles preparation, browser upload, and finalization. Depending on the workflow, wallet signing and Shelby storage configuration are required.

The existing upload implementation should be used rather than sending private credentials from the browser.

See:

- Upload Pipeline
- Storage Engine
- Developer Platform

for the implementation details.

## 9. From Shelby Studio to Your Application

A typical developer workflow looks like this:

```
Explore
   ↓
API Playground
   ↓
Inspect request/response
   ↓
Generate example
   ↓
Copy into your application
   ↓
Connect your application logic
   ↓
Integrate Shelby storage
```

Start with the API Playground, then use the Code Generator and Examples when you are ready to integrate.

## 10. Security

Never expose private Shelby credentials or server-side secrets in client-side application code.

In particular, server-side credentials should remain on the server and should not be placed in public browser bundles.

For production applications, keep sensitive configuration in server-side environment variables.

## 11. Where to Go Next

**API Playground**
Experiment with the Shelby Studio API operations interactively.

**SDK Explorer**
Review the Shelby SDK operations currently exposed through the developer platform.

**Code Generator**
Generate request examples that you can adapt to your application.

**Examples**
Follow practical examples for common Shelby Studio API operations.

**Architecture**
Understand how Shelby Studio connects the application layer, API layer, Shelby SDK, storage and blockchain components.

**Upload Pipeline**
Understand how files move through the Shelby upload workflow.

Next step: Open the Developer workspace and run your first API request in the API Playground.
