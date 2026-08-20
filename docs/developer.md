# Developer Platform

Shelby Studio includes a dedicated developer workspace for exploring the platform API, Shelby SDK resources, generated code, and integration examples.

The Developer workspace is designed to give developers one place to:

- Explore Shelby Studio API operations
- Execute API requests
- Inspect live JSON responses
- Inspect Shelby asset metadata
- Look up Shelby objects directly
- Download Shelby assets
- Inspect available storage locations
- Explore the Shelby SDK operations behind the API
- Generate integration code
- Study practical integration examples

---

## Developer Workspace

The main developer workspace is available at:

```text
/developer
```

The workspace contains four primary areas:

```text
/developer
    |
    +-- API Playground
    |
    +-- SDK Explorer
    |
    +-- Code Generator
    |
    +-- Examples
```

The developer workspace is separate from the experimental:

```text
/playground
```

The `/playground` route remains a lightweight experimentation surface, while `/developer` is the primary developer platform.

### Architecture

The developer platform follows a server-side API architecture.

```text
Developer Browser
       |
       v
Shelby Studio Developer UI
       |
       v
Shelby Studio API Routes
       |
       v
Shelby Node SDK
       |
       v
Shelbynet
       |
       v
Shelby Storage / Coordination
```

The browser does not directly receive the Shelby server credentials.

Instead, the browser communicates with the application's API routes.

The API routes execute Shelby SDK operations on the server.

This keeps the following credentials server-side:

- `SHELBY_SIGNER_PRIVATE_KEY`
- `SHELBY_API_KEY`

### Network Configuration

The current developer API implementation is configured for:

- Network: `Shelbynet`
- Location: `shelbynet-1`

The Shelby Node SDK is initialized using:

```text
Network.SHELBYNET
```

Where applicable, the configured location hint is:

```text
shelbynet-1
```

The API responses also expose the network information so developer tools can identify the active environment.

Example:

```json
{
  "network": "Shelbynet",
  "location": "shelbynet-1"
}
```

### Server Credentials

Shelby Studio uses server-side environment variables for Shelby access.

Required credentials include:

- `SHELBY_API_KEY`
- `SHELBY_SIGNER_PRIVATE_KEY`

These values must remain on the server.

They must not be exposed to client-side components or returned through API responses.

The developer interface communicates with the application's API routes instead of directly exposing the private signer or API key.

---

## API Playground

The API Playground provides an interactive interface for executing Shelby Studio API operations and inspecting live responses.

The current operations are:

| Operation      | Method | Endpoint                |
| -------------- | ------ | ------------------------ |
| List Assets    | GET    | `/api/shelby/assets`     |
| Inspect Asset  | GET    | `/api/shelby/asset`      |
| Object Lookup  | GET    | `/api/shelby/object`     |
| Download Asset | GET    | `/api/shelby/download`   |
| List Locations | GET    | `/api/shelby/locations`  |

The Playground supports request parameters where required and displays returned JSON responses directly inside the developer workspace.

### API Routes

#### List Assets

**Endpoint**

```text
GET /api/shelby/assets
```

**Purpose**

Lists Shelby blobs owned by the configured Shelby Studio account.

**Server implementation**

The route creates a Shelby client using:

- `ShelbyClient`
- `Network.SHELBYNET`
- `SHELBY_API_KEY`
- `shelbynet-1`

The configured signer account is created from:

```text
SHELBY_SIGNER_PRIVATE_KEY
```

The account's blobs are then retrieved using:

```text
coordination.getAccountBlobs()
```

The current implementation requests:

- `limit: 100`
- `offset: 0`

**Response**

The route returns:

```json
{
  "success": true,
  "network": "Shelbynet",
  "account": "0x...",
  "count": 0,
  "assets": []
}
```

Each returned asset can contain:

- `uid`
- `owner`
- `name`
- `blobName`
- `size`
- `network`
- `location`
- `creationMicros`
- `expirationMicros`
- `encryption`

**Example**

```text
GET /api/shelby/assets
```

#### Inspect Asset

**Endpoint**

```text
GET /api/shelby/asset
```

**Parameter**

`blobName`

**Example**

```text
GET /api/shelby/asset?blobName=<blob-name>
```

**Purpose**

Retrieves complete metadata for a specific Shelby blob.

The route validates the supplied blob name using the Shelby SDK's:

```text
BlobNameSchema
```

The route then performs a direct metadata lookup using:

```text
coordination.getFullObjectMetadata()
```

The lookup uses the configured Shelby signer account.

**Returned metadata**

The returned asset metadata can include:

- `uid`
- `owner`
- `name`
- `blobName`
- `size`
- `creationMicros`
- `expirationMicros`
- `sliceAddress`
- `encryption`

Example response structure:

```json
{
  "success": true,
  "network": "Shelbynet",
  "location": "shelbynet-1",
  "asset": {
    "uid": "...",
    "owner": "0x...",
    "name": "...",
    "blobName": "...",
    "size": 0,
    "creationMicros": 0,
    "expirationMicros": 0,
    "sliceAddress": "0x...",
    "encryption": null
  }
}
```

If the blob cannot be found, the route returns a 404 response.

#### Object Lookup

**Endpoint**

```text
GET /api/shelby/object
```

**Parameter**

`blobName`

**Example**

```text
GET /api/shelby/object?blobName=<blob-name>
```

**Purpose**

Object Lookup provides a direct Shelby object metadata lookup.

It is similar to Inspect Asset but is exposed as a separate API operation for lower-level object inspection.

The supplied blob name is validated with:

```text
BlobNameSchema
```

The route then calls:

```text
coordination.getFullObjectMetadata()
```

**Response**

When the object exists:

```json
{
  "success": true,
  "found": true,
  "network": "Shelbynet",
  "location": "shelbynet-1",
  "asset": {
    "uid": "...",
    "owner": "0x...",
    "name": "...",
    "blobName": "...",
    "size": 0,
    "creationMicros": 0,
    "expirationMicros": 0,
    "encryption": null,
    "sliceAddress": "0x..."
  }
}
```

When the object does not exist:

```json
{
  "success": false,
  "found": false,
  "account": "0x...",
  "blobName": "..."
}
```

The route returns HTTP 404 when the object is not found.

#### Download Asset

**Endpoint**

```text
GET /api/shelby/download
```

**Parameters**

- `blobName`
- `owner`

**Example**

```text
GET /api/shelby/download?blobName=<blob-name>&owner=<owner-address>
```

**Purpose**

Downloads the contents of an existing Shelby blob.

The route requires:

```text
SHELBY_API_KEY
```

The Shelby client is initialized using:

- `Network.SHELBYNET`
- `locationHint: shelbynet-1`

The asset is retrieved using:

```text
client.download()
```

The request passes:

- `account: owner`
- `blobName: blobName`

The returned readable stream is consumed server-side.

The chunks are combined into a single `Uint8Array`.

The API then returns the resulting bytes as a downloadable response.

**Response headers**

The download response includes:

- `Content-Type: application/octet-stream`
- `Content-Disposition: attachment`
- `Content-Length`
- `X-Shelby-Network: Shelbynet`

The filename is derived from the final section of the blob name.

**Example**

```text
GET /api/shelby/download?blobName=example/file.json&owner=0x...
```

The browser receives the file and the API Playground triggers a browser download.

#### List Locations

**Endpoint**

```text
GET /api/shelby/locations
```

**Purpose**

Retrieves the storage locations exposed by the configured Shelby network.

The route creates a Shelby client using:

- `Network.SHELBYNET`
- `SHELBY_API_KEY`

The SDK operation used is:

```text
metadata.getLocationNames()
```

**Example**

```text
GET /api/shelby/locations
```

**Response**

```json
{
  "network": "Shelbynet",
  "locations": []
}
```

### API Error Handling

The API routes return JSON errors when requests cannot be completed.

Common configuration errors include:

- Shelby signer is not configured.
- Shelby API key is not configured.
- Shelby API key is missing.
- Shelby server credentials are missing.

Missing request parameters return HTTP 400.

Examples include:

- `blobName` query parameter is required.
- `blobName` is required.
- `blobName` and `owner` are required.

Missing or unavailable Shelby objects return HTTP 404 where supported.

Unexpected server-side failures return HTTP 500.

---

## Storage API

Shelby Studio also contains server-side routes responsible for the upload pipeline.

Current storage routes:

| Route                          | Purpose             |
| ------------------------------- | -------------------- |
| `/api/storage/prepare-upload`   | Prepare an upload    |
| `/api/storage/stream-upload`    | Stream upload data   |
| `/api/storage/finalize-upload`  | Finalize an upload   |
| `/api/storage/upload`           | Upload entry point   |

These routes are part of the application's storage pipeline.

They should be considered separately from the read-oriented developer API.

### Upload Architecture

The storage pipeline is conceptually separated into preparation, streaming, and finalization.

```text
Browser
   |
   v
Prepare Upload
   |
   v
Stream Upload
   |
   v
Shelby Storage
   |
   v
Finalize Upload
```

The `/api/storage/upload` route acts as an upload entry point.

The developer API focuses primarily on inspection and integration, while the storage API handles the application's upload workflow.

---

## SDK Explorer

The SDK Explorer exposes the Shelby SDK operations currently implemented behind Shelby Studio's API.

Current operations:

| Operation      | Shelby SDK operation                     | Endpoint                 |
| -------------- | ------------------------------------------ | -------------------------- |
| List Assets    | `coordination.getAccountBlobs()`           | `/api/shelby/assets`       |
| Inspect Asset  | `coordination.getFullObjectMetadata()`     | `/api/shelby/asset`        |
| Object Lookup  | `coordination.getFullObjectMetadata()`     | `/api/shelby/object`       |
| Download Asset | `client.download()`                        | `/api/shelby/download`     |
| List Locations | `metadata.getLocationNames()`              | `/api/shelby/locations`    |

The SDK operations execute server-side.

The current SDK runtime is:

```text
Node
```

All five operations are currently marked: **Implemented**

### SDK Operation: List Assets

```text
coordination.getAccountBlobs()
```

**Purpose:**

Retrieve blobs owned by the configured Shelby account.

The API route maps the SDK result into a developer-friendly asset structure.

### SDK Operation: Inspect Asset

```text
coordination.getFullObjectMetadata()
```

**Purpose:**

Retrieve complete metadata for a specific Shelby object.

The operation requires:

`blobName`

The account is supplied from the configured server-side signer.

### SDK Operation: Object Lookup

```text
coordination.getFullObjectMetadata()
```

**Purpose:**

Perform a direct object metadata lookup.

The operation requires:

`blobName`

The blob name is validated before the SDK operation is executed.

### SDK Operation: Download

```text
client.download()
```

**Purpose:**

Download the contents of a Shelby blob.

Required values:

- `blobName`
- `owner`

The server consumes the returned readable stream and returns the file to the browser.

### SDK Operation: List Locations

```text
metadata.getLocationNames()
```

**Purpose:**

Retrieve storage location names available through the configured Shelby network.

### Server-Side SDK Execution

The developer platform intentionally keeps Shelby credentials on the server.

The browser performs:

```text
fetch("/api/shelby/...")
```

The API route then performs:

```text
ShelbyClient
      |
      v
Shelby SDK operation
      |
      v
Shelbynet
```

This means the browser does not need direct access to:

- `SHELBY_SIGNER_PRIVATE_KEY`
- `SHELBY_API_KEY`

---

## Code Generator

The Code Generator produces copy-pasteable integration examples.

Supported operations:

- List Assets
- Inspect Asset
- Object Lookup
- Download Asset
- List Locations

Supported languages:

- cURL
- JavaScript
- TypeScript

Generated examples use the Shelby Studio API rather than exposing the underlying private server credentials.

### Generated cURL

Example:

```bash
curl "https://your-domain.com/api/shelby/assets"
```

Asset inspection:

```bash
curl "https://your-domain.com/api/shelby/asset?blobName=example/file.json"
```

Object lookup:

```bash
curl "https://your-domain.com/api/shelby/object?blobName=example/file.json"
```

Locations:

```bash
curl "https://your-domain.com/api/shelby/locations"
```

Download:

```bash
curl -L "https://your-domain.com/api/shelby/download?blobName=example/file.json&owner=0x..." \
  -o downloaded-file
```

### Generated JavaScript

Example:

```javascript
const response = await fetch(
  "https://your-domain.com/api/shelby/assets"
);

if (!response.ok) {
  throw new Error("Request failed");
}

const data = await response.json();

console.log(data);
```

Asset inspection:

```javascript
const blobName = "example/file.json";

const response = await fetch(
  `https://your-domain.com/api/shelby/asset?blobName=${encodeURIComponent(blobName)}`
);

if (!response.ok) {
  throw new Error("Request failed");
}

const data = await response.json();

console.log(data);
```

### Generated TypeScript

The TypeScript generator produces the same API workflow while explicitly typing the fetch response as a `Response` and the returned JSON as `unknown`.

Example:

```typescript
const response: Response = await fetch(
  "https://your-domain.com/api/shelby/assets"
);

if (!response.ok) {
  throw new Error("Request failed");
}

const data: unknown = await response.json();

console.log(data);
```

### Download Example

A download integration can use:

```javascript
const response = await fetch(
  "https://your-domain.com/api/shelby/download?blobName=example/file.json&owner=0x..."
);

if (!response.ok) {
  throw new Error("Download failed");
}

const blob = await response.blob();

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "downloaded-file";

link.click();

URL.revokeObjectURL(url);
```

---

## Examples

The Examples section provides practical workflows for working with Shelby Studio.

Current examples include:

- List your assets
- Inspect an asset
- Look up an object
- Download an asset
- Check storage locations

### Example: List Assets

```javascript
const response = await fetch("/api/shelby/assets");

const data = await response.json();

console.log(data.assets);
```

Workflow:

1. Open the Developer workspace.
2. Select List Assets.
3. Run the request.
4. Inspect the returned asset metadata.

### Example: Inspect an Asset

```javascript
const blobName = "example/file.json";

const response = await fetch(
  `/api/shelby/asset?blobName=${encodeURIComponent(blobName)}`
);

const data = await response.json();

console.log(data.asset);
```

Workflow:

1. Copy the asset blob name.
2. Open Inspect Asset.
3. Enter the blob name.
4. Run the request.
5. Inspect the metadata.

### Example: Object Lookup

```javascript
const blobName = "example/file.json";

const response = await fetch(
  `/api/shelby/object?blobName=${encodeURIComponent(blobName)}`
);

const data = await response.json();

console.log(data.asset);
```

Workflow:

1. Enter the blob name.
2. Select Object Lookup.
3. Run the request.
4. Review the returned metadata.

### Example: Download an Asset

```javascript
const blobName = "example/file.json";
const owner = "0x...";

const response = await fetch(
  `/api/shelby/download?blobName=${encodeURIComponent(blobName)}&owner=${encodeURIComponent(owner)}`
);

if (!response.ok) {
  throw new Error("Download failed");
}

const file = await response.blob();
```

Workflow:

1. Identify the asset blob name.
2. Identify the asset owner.
3. Request the download endpoint.
4. Handle the returned file response.

### Example: Check Storage Locations

```javascript
const response = await fetch(
  "/api/shelby/locations"
);

const data = await response.json();

console.log(data.locations);
```

Workflow:

1. Open List Locations.
2. Run the request.
3. Inspect the returned locations.
4. Use the available location information when building integrations.

---

## API Playground vs Developer Workspace

The `/playground` route is currently a lightweight experimentation page.

The `/developer` workspace is the primary developer surface.

```text
/developer
    |
    +-- API Playground
    +-- SDK Explorer
    +-- Code Generator
    +-- Examples
```

Experimental playground:

```text
/playground
    |
    +-- Experimental Playground
```

---

## Developer API Summary

The current developer API consists of five Shelby routes:

- `/api/shelby/assets`
- `/api/shelby/asset`
- `/api/shelby/object`
- `/api/shelby/download`
- `/api/shelby/locations`

And four storage routes:

- `/api/storage/prepare-upload`
- `/api/storage/stream-upload`
- `/api/storage/finalize-upload`
- `/api/storage/upload`

Together these provide the developer workspace with:

- Asset listing
- Asset inspection
- Object lookup
- Asset downloads
- Location discovery
- Upload workflows
- SDK exploration
- Code generation
- Integration examples

## Current Implementation Scope

The developer platform currently focuses on:

- Shelby API exploration
- Asset inspection
- Object lookup
- Asset downloads
- Storage location inspection
- Upload API workflows
- Shelby SDK discovery
- Server-side SDK execution
- Code generation
- cURL examples
- JavaScript examples
- TypeScript examples
- Integration examples
- Developer documentation

---

## Security Boundary

The developer platform is intentionally divided into client and server responsibilities.

```text
CLIENT
  |
  | API requests
  v
SERVER
  |
  | Shelby SDK
  | Private credentials
  v
SHELBY
```

Client-side code should not contain:

- `SHELBY_SIGNER_PRIVATE_KEY`
- `SHELBY_API_KEY`

The API layer is responsible for performing privileged Shelby operations.

This boundary allows the Developer workspace to provide useful Shelby functionality without exposing the server's private credentials to the browser.

### Implementation Notes

The Shelby API routes use the Node runtime.

The relevant routes explicitly declare:

```typescript
export const runtime = "nodejs";
```

This is required because the Shelby Node SDK and server-side credential handling belong on the server.

### Validation

Blob names supplied to metadata lookup routes are validated through the Shelby SDK's:

```text
BlobNameSchema
```

This is used by:

- `/api/shelby/asset`
- `/api/shelby/object`

Invalid or missing blob names are rejected before the underlying lookup is performed.

### API Response Philosophy

Developer API responses are designed to be useful both to the Developer workspace and to external integrations.

Responses generally expose:

- `success`
- `network`
- `location`
- `account`
- asset metadata
- error information

depending on the operation.

This allows the API Playground to display raw JSON while also giving developers predictable information for application integrations.

---

## Future Scope

AI-assisted developer functionality is planned separately.

It is currently considered a future capability and is not part of the implemented API surface described above.

Future developer tooling may build on the existing:

- API Playground
- SDK Explorer
- Code Generator
- Examples

without changing the underlying server-side security boundary.

---

## Developer Platform Status

Current implemented developer operations:

| Feature                       | Status      |
| ------------------------------ | ----------- |
| API Playground                 | Implemented |
| List Assets                    | Implemented |
| Inspect Asset                  | Implemented |
| Object Lookup                  | Implemented |
| Download Asset                 | Implemented |
| List Locations                 | Implemented |
| SDK Explorer                   | Implemented |
| Code Generator                 | Implemented |
| cURL generation                | Implemented |
| JavaScript generation          | Implemented |
| TypeScript generation          | Implemented |
| Integration Examples           | Implemented |
| Server-side SDK execution      | Implemented |
| Server-side credential protection | Implemented |
| AI developer assistant         | Coming soon |

---

## Developer Platform Overview

The complete developer architecture can be summarized as:

```text
                         SHELBY STUDIO
                              |
                              v
                     Developer Workspace
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
   API Playground       SDK Explorer       Code Generator
          |                   |                   |
          +-------------------+-------------------+
                              |
                              v
                       Shelby Studio API
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
       Assets             Objects            Downloads
          |                   |                   |
          +-------------------+-------------------+
                              |
                              v
                        Shelby Node SDK
                              |
                              v
                           Shelbynet
```

The Developer workspace provides the interface, while the server-side API layer provides the secure boundary between browser applications and Shelby infrastructure.

---

# Developer Platform Implementation

This section documents the current implementation of the Shelby Studio Developer workspace.

## Developer Workspace

The Developer workspace is available at:

```text
/developer
```

It currently contains:

```text
Developer
│
├── API Playground
├── SDK Explorer
├── Code Generator
└── Examples
```

The workspace is implemented using the following components:

```text
components/developer/
├── APIPlayground.tsx
├── CodeGenerator.tsx
├── DeveloperHeader.tsx
├── Examples.tsx
└── SDKExplorer.tsx
```

### Developer Header

**Component**

```text
components/developer/DeveloperHeader.tsx
```

The Developer Header provides the main identity and context for the developer workspace.

It displays:

- Developer title
- ShelbyNet network indicator
- Developer workspace description

The current network label is:

```text
ShelbyNet
```

The header communicates that Shelby Studio can be used to build, test, inspect, and integrate with Shelby.

### API Playground

**Component**

```text
components/developer/APIPlayground.tsx
```

The API Playground provides an interactive interface for executing Shelby Studio API operations directly from the Developer workspace.

It supports:

- Selecting an operation
- Entering required parameters
- Executing requests
- Inspecting JSON responses
- Copying JSON responses
- Downloading Shelby assets
- Displaying request errors

**Supported Operations**

The current API Playground operations are:

| Operation      | Endpoint                | Parameters          |
| -------------- | ------------------------ | -------------------- |
| List Assets    | `/api/shelby/assets`     | None                  |
| Inspect Asset  | `/api/shelby/asset`      | `blobName`            |
| Object Lookup  | `/api/shelby/object`     | `blobName`            |
| List Locations | `/api/shelby/locations`  | None                  |
| Download Asset | `/api/shelby/download`   | `blobName`, `owner`   |

#### List Assets

```text
GET /api/shelby/assets
```

Lists assets available through the configured Shelby Studio account.

#### Inspect Asset

```text
GET /api/shelby/asset?blobName=<blob-name>
```

Retrieves metadata for a specific Shelby asset.

#### Object Lookup

```text
GET /api/shelby/object?blobName=<blob-name>
```

Performs a direct Shelby object metadata lookup.

#### List Locations

```text
GET /api/shelby/locations
```

Retrieves available Shelby storage locations.

#### Download Asset

```text
GET /api/shelby/download?blobName=<blob-name>&owner=<owner-address>
```

Downloads the contents of a Shelby asset.

The download operation requires:

- `blobName`
- `owner`

The browser receives the returned file as a Blob and triggers a local download.

### Shelby API Routes

The Developer Platform communicates with server-side Shelby API routes.

Current routes:

```text
app/api/shelby/
├── asset/route.ts
├── assets/route.ts
├── download/route.ts
├── locations/route.ts
└── object/route.ts
```

#### Route Responsibilities

**`/api/shelby/assets`**

Provides asset listing functionality.

```text
GET /api/shelby/assets
```

**`/api/shelby/asset`**

Provides detailed inspection of a specific asset.

```text
GET /api/shelby/asset?blobName=<blob-name>
```

**`/api/shelby/object`**

Provides direct object metadata lookup.

```text
GET /api/shelby/object?blobName=<blob-name>
```

**`/api/shelby/locations`**

Provides available Shelby storage location information.

```text
GET /api/shelby/locations
```

**`/api/shelby/download`**

Provides server-side asset download functionality.

```text
GET /api/shelby/download?blobName=<blob-name>&owner=<owner-address>
```

These routes form the application API layer between the browser and the Shelby integration.

### Storage API

Shelby Studio also contains a separate storage API layer used by the upload pipeline.

Current routes:

```text
app/api/storage/
├── finalize-upload/route.ts
├── prepare-upload/route.ts
├── stream-upload/route.ts
└── upload/route.ts
```

**Prepare Upload**

```text
/api/storage/prepare-upload
```

Prepares the upload process before data is transmitted to storage.

**Stream Upload**

```text
/api/storage/stream-upload
```

Handles the streaming stage of the upload pipeline.

**Finalize Upload**

```text
/api/storage/finalize-upload
```

Completes the upload workflow after the storage operation has been prepared and transmitted.

**Upload Entry Point**

```text
/api/storage/upload
```

Provides the upload entry point used by the application's storage workflow.

These storage routes are separate from the read-oriented Developer API routes.

### SDK Explorer

**Component**

```text
components/developer/SDKExplorer.tsx
```

The SDK Explorer exposes the Shelby operations currently implemented behind Shelby Studio's developer API.

The current Explorer contains five operations.

#### Implemented SDK Operations

**1. List Assets**

SDK:

```text
coordination.getAccountBlobs()
```

API:

```text
GET /api/shelby/assets
```

Lists Shelby blobs owned by the configured Shelby Studio account.

**2. Inspect Asset**

SDK:

```text
coordination.getFullObjectMetadata()
```

API:

```text
GET /api/shelby/asset
```

Parameters:

- `blobName`

Retrieves complete metadata for a specific Shelby blob.

**3. Object Lookup**

SDK:

```text
coordination.getFullObjectMetadata()
```

API:

```text
GET /api/shelby/object
```

Parameters:

- `blobName`

Performs a direct object metadata lookup.

**4. Download Asset**

SDK:

```text
client.download()
```

API:

```text
GET /api/shelby/download
```

Parameters:

- `blobName`
- `owner`

Downloads the contents of a Shelby blob.

**5. List Locations**

SDK:

```text
metadata.getLocationNames()
```

API:

```text
GET /api/shelby/locations
```

Retrieves the storage locations exposed by the configured Shelby network.

#### SDK Runtime

The current SDK operations are executed server-side.

```text
Browser
   |
   v
Shelby Studio API
   |
   v
Shelby SDK
   |
   v
Shelby Storage
```

Private credentials and signer information remain on the server rather than being exposed to the browser.

### Code Generator

**Component**

```text
components/developer/CodeGenerator.tsx
```

The Code Generator creates copy-pasteable integration examples for the Shelby Studio API.

**Supported Languages**

The current generator supports:

- cURL
- JavaScript
- TypeScript

**Supported Operations**

The generator supports:

- List Assets
- Inspect Asset
- Object Lookup
- Download Asset
- List Locations

**Generated Requests**

The generated examples use the corresponding Shelby Studio API route.

Example:

```text
GET /api/shelby/assets
```

A generated cURL request uses:

```bash
curl "https://your-domain.com/api/shelby/assets"
```

JavaScript and TypeScript examples use the browser or server-side `fetch()` API.

**Parameters**

Operations requiring parameters expose input fields for:

- `blobName`
- `owner`

The generated endpoint automatically includes populated parameters as URL query parameters.

### Examples

**Component**

```text
components/developer/Examples.tsx
```

The Examples section provides practical workflows for interacting with Shelby through Shelby Studio.

Current examples:

- List your assets
- Inspect an asset
- Look up an object
- Download an asset
- Check storage locations

**List Your Assets**

Example request:

```javascript
const response = await fetch("/api/shelby/assets");

const data = await response.json();

console.log(data.assets);
```

**Inspect an Asset**

Example request:

```javascript
const blobName = "example/file.json";

const response = await fetch(
  `/api/shelby/asset?blobName=${encodeURIComponent(blobName)}`
);

const data = await response.json();

console.log(data.asset);
```

**Look Up an Object**

Example request:

```javascript
const blobName = "example/file.json";

const response = await fetch(
  `/api/shelby/object?blobName=${encodeURIComponent(blobName)}`
);

const data = await response.json();

console.log(data.asset);
```

**Download an Asset**

Example request:

```javascript
const blobName = "example/file.json";
const owner = "0x...";

const response = await fetch(
  `/api/shelby/download?blobName=${encodeURIComponent(blobName)}&owner=${encodeURIComponent(owner)}`
);

if (!response.ok) {
  throw new Error("Download failed");
}

const file = await response.blob();
```

**Check Storage Locations**

Example request:

```javascript
const response = await fetch(
  "/api/shelby/locations"
);

const data = await response.json();

console.log(data.locations);
```

### Developer API Architecture

The Developer Platform follows a layered architecture:

```text
┌───────────────────────────────┐
│        Developer UI           │
│                               │
│  Playground                   │
│  SDK Explorer                 │
│  Code Generator               │
│  Examples                     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│      Shelby Studio API        │
│                               │
│  /api/shelby/*                │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Shelby Integration      │
│                               │
│      Shelby Node SDK          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Shelby Storage           │
└───────────────────────────────┘
```

The browser interacts with application-owned API routes rather than directly receiving private Shelby credentials.

### Developer Workspace vs Playground

Shelby Studio currently contains two developer-oriented surfaces.

**Developer Workspace**

```text
/developer
```

The primary developer experience.

Contains:

- API Playground
- SDK Explorer
- Code Generator
- Examples

**Experimental Playground**

```text
/playground
```

The existing lightweight experimentation surface.

The `/playground` route remains separate from the primary Developer workspace.

### Current Developer Platform Scope

The current implementation covers:

- Shelby API exploration
- Asset listing
- Asset inspection
- Object lookup
- Asset downloads
- Storage location inspection
- Upload API workflows
- SDK operation discovery
- Code generation
- JavaScript examples
- TypeScript examples
- cURL examples
- Integration workflows
- Server-side SDK execution
- Developer documentation

AI-assisted developer functionality is planned separately and remains marked as coming soon.

### Developer Platform File Map

```text
app/
├── developer/
│   └── page.tsx
│
├── api/
│   ├── shelby/
│   │   ├── asset/
│   │   │   └── route.ts
│   │   ├── assets/
│   │   │   └── route.ts
│   │   ├── download/
│   │   │   └── route.ts
│   │   ├── locations/
│   │   │   └── route.ts
│   │   └── object/
│   │       └── route.ts
│   │
│   └── storage/
│       ├── finalize-upload/
│       │   └── route.ts
│       ├── prepare-upload/
│       │   └── route.ts
│       ├── stream-upload/
│       │   └── route.ts
│       └── upload/
│           └── route.ts
│
components/
└── developer/
    ├── APIPlayground.tsx
    ├── CodeGenerator.tsx
    ├── DeveloperHeader.tsx
    ├── Examples.tsx
    └── SDKExplorer.tsx
```

### Implementation Status

The Developer Platform currently contains:

| Feature                | Status      |
| ----------------------- | ----------- |
| Developer Workspace     | Implemented |
| API Playground          | Implemented |
| SDK Explorer            | Implemented |
| Code Generator          | Implemented |
| Examples                | Implemented |
| Shelby API Routes       | Implemented |
| Storage API Routes      | Implemented |
| Server-side SDK Layer   | Implemented |
| AI Developer Tools      | Coming Soon |

This documentation reflects the current implementation of Shelby Studio's Developer Platform.
