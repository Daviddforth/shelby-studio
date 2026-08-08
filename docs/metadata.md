# Metadata

Shelby Studio includes NFT metadata tooling as part of its project-centric development workspace. The metadata system helps developers create, edit, validate, preview, import, and export structured NFT metadata while keeping metadata associated with the broader project workflow.

Metadata is not treated as an isolated JSON generator — it is intended to work alongside project assets, collections, and future publication workflows.

## Overview

The Metadata workspace provides tools for preparing structured NFT metadata. The current implementation includes:

- NFT information management
- Image handling
- Attribute management
- Metadata templates
- Metadata validation
- JSON preview
- Metadata import
- Metadata actions
- Project-aware metadata workflows

The metadata system is implemented primarily through reusable React components and supporting library utilities.

## Architecture

**UI components:**
```
components/metadata/
├── ActiveProjectBanner.tsx
├── AttributeBuilder.tsx
├── ImageUploader.tsx
├── ImportMetadata.tsx
├── JsonPreview.tsx
├── MetadataActions.tsx
├── MetadataHeader.tsx
├── MetadataTemplates.tsx
├── MetadataValidation.tsx
├── NFTInformation.tsx
└── NFTPreview.tsx
```

**Supporting library layer:**
```
lib/
├── generateMetadata.ts
├── validateMetadata.ts
└── validation.ts
```

These layers separate the user interface from metadata generation and validation logic.

## Metadata Workflow

```
Open Metadata Workspace
        │
        ▼
Select / Confirm Project
        │
        ▼
Enter NFT Information
        │
        ▼
Add Image
        │
        ▼
Add Attributes
        │
        ▼
Apply Template
        │
        ▼
Validate Metadata
        │
        ▼
Preview JSON
        │
        ▼
Export / Use Metadata
```

The exact workflow can vary depending on how the developer is preparing the asset.

### NFT Information

The NFT information interface provides the basic descriptive fields required to construct metadata:

- Name
- Description
- Image information
- External information (where supported)
- NFT-specific descriptive fields

The metadata structure is intended to remain compatible with common NFT metadata workflows while allowing the project to evolve its own metadata model.

### Image Handling

Images are an important part of the metadata workflow. Shelby Studio provides an image uploader for the metadata workspace, allowing developers to:

- Select an image
- Preview the selected image
- Associate the image with metadata
- Prepare the resulting image reference for the generated metadata

Image storage and metadata generation are related but separate responsibilities: the **metadata system** describes the asset, while the **Storage system** is responsible for storing the underlying asset on Shelby.

### Attribute Builder

The Attribute Builder allows developers to create structured NFT traits. Attributes can be added, edited, and removed through the metadata interface.

A typical attribute structure follows the common NFT pattern:

```json
{
  "trait_type": "Background",
  "value": "Blue"
}
```

Multiple attributes combine into an NFT metadata record:

```json
{
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Eyes", "value": "Laser" }
  ]
}
```

The attribute system is designed to make trait management easier than manually editing JSON.

### Metadata Templates

The metadata workspace includes metadata templates — predefined structures that help developers begin creating metadata without constructing every field manually. Templates are intended to improve consistency across assets within a collection or project.

Future template capabilities may expand to support (planned, unless already implemented):

- Collection-specific templates
- Custom templates
- Reusable project templates
- Template import and export

### Metadata Validation

Validation identifies incomplete or invalid metadata before it is exported or used elsewhere in the application. The validation layer is separated from the presentation components so validation rules can evolve independently of the interface.

```
Metadata
   │
   ▼
Validation Rules
   │
   ├── Valid
   │
   └── Invalid
         │
         ▼
   Validation Feedback
```

Validation should be treated as a preparation step, not proof that an asset has been successfully stored or published.

### JSON Preview

The JSON Preview component shows the metadata structure that will be generated, before export.

Simplified example:

```json
{
  "name": "Example NFT",
  "description": "Example NFT description",
  "image": "image-uri",
  "attributes": [
    { "trait_type": "Background", "value": "Blue" }
  ]
}
```

The actual output depends on the metadata entered by the developer.

### Metadata Import

An import workflow allows existing structured metadata to be brought into the workspace rather than requiring developers to recreate it manually. Imported metadata can then be reviewed and processed through the available metadata tools. Future improvements may include more advanced import validation and compatibility handling.

### Metadata Actions

The metadata action layer supports operations such as:

- Saving metadata
- Downloading metadata
- Resetting metadata
- Generating metadata output

Exact available actions depend on the current implementation.

## Project Integration

Metadata operates within the project system:

```
Project
│
├── Assets
├── Metadata
├── Collections
├── Storage
└── Publication
```

This allows metadata to be developed alongside the assets it describes, and provides a foundation for future workflows associating metadata with collections and publication-ready assets.

## Storage Integration

Metadata and asset storage are related but distinct:

```
Image
  │
  ▼
Storage
  │
  ▼
Shelby Asset
  │
  ▼
Storage URI
  │
  ▼
NFT Metadata
  │
  ▼
JSON Metadata
```

The **Storage system** is responsible for the decentralized asset. The **Metadata system** is responsible for describing the asset. This separation allows developers to modify metadata without unnecessarily coupling metadata generation to storage implementation details.

## Collection Integration

Metadata works closely with the Collections system. A collection may contain multiple NFTs, each with its own metadata:

```
Collection
│
├── NFT 1 → Metadata
├── NFT 2 → Metadata
├── NFT 3 → Metadata
└── ...
```

The current implementation provides the metadata-building foundation for this workflow. More advanced collection-wide metadata generation remains part of the broader development roadmap.

## Metadata Generation

The library layer converts the metadata state maintained by the application into structured output:

```
Metadata State
      │
      ▼
Generation Logic
      │
      ▼
Structured Metadata
      │
      ▼
JSON Output
```

Keeping generation logic separate from UI components allows the same functionality to be reused by future workflows.

## Relationship With Publication

Metadata preparation is part of the broader project lifecycle but does not by itself publish a project:

```
Create Project → Add Assets → Store Assets → Create Metadata → Validate Project → Publish
```

Publication status should be derived from the actual project and publication records — not simply assumed because metadata is valid.

## Current Implementation

The current Metadata workspace provides:

- NFT information editing
- Image upload and preview
- Attribute creation and management
- Metadata templates
- Metadata validation
- JSON preview
- Metadata import
- Metadata actions
- Metadata generation utilities
- Project-aware metadata workspace

These capabilities form the current metadata foundation of Shelby Studio.

## Planned Development

- **Collection Metadata** — generate and manage metadata across an entire collection
- **Batch Generation** — generate metadata for multiple assets from structured project data
- **Advanced Templates** — reusable project and collection-specific metadata templates
- **Storage-Aware Metadata** — automatically associate stored Shelby asset references with generated metadata
- **Metadata Versioning** — track changes to metadata over an asset's lifecycle
- **Publication Integration** — stronger validation between metadata, stored assets, and project publication requirements
- **Mint-Ready Export** — complete asset and metadata packages for downstream minting workflows

## Engineering Considerations

Metadata should remain independent from storage implementation wherever possible:

- The system should not assume every metadata record represents a successfully stored asset.
- Successful storage should not automatically imply that metadata is valid.
- The two systems should communicate through explicit data structures and project relationships.

This separation makes it possible to:

- Replace or update assets
- Modify metadata independently
- Validate metadata before publication
- Support different metadata formats in the future
- Introduce batch workflows without redesigning the storage layer

## Data Model

```
Project
   │
   ├── Project Asset
   │       │
   │       ├── Storage Information
   │       └── Metadata
   │
   └── Collection
           │
           └── Collection Assets
                   │
                   └── Metadata
```

The exact application data model may evolve as persistent project storage and collection-wide workflows are introduced.

## Limitations

The current metadata implementation is primarily a development and preparation workspace — not a complete NFT minting system. It does not by itself provide:

- NFT minting
- Marketplace listing
- Blockchain ownership management
- Collection-wide decentralized indexing
- Full metadata version history
- Complete multi-user collaboration

These capabilities may be introduced through future modules.

## Design Principles

- **Structured** — metadata should be represented as structured data rather than manually maintained unvalidated JSON.
- **Reusable** — generation and validation logic should remain reusable across different interfaces.
- **Project-Centric** — metadata should remain associated with the project and assets it describes.
- **Verifiable** — metadata should be validated before being treated as ready.
- **Independent** — metadata generation should not be tightly coupled to storage implementation.
- **Extensible** — the system should support future collection, batch, and publication workflows without requiring a complete rewrite.

## Summary

The Metadata system is one of the core development modules within Shelby Studio. It provides developers with tools for creating NFT metadata, managing attributes, handling images, validating structured data, importing existing metadata, previewing JSON, and preparing metadata for broader project workflows.

The system currently serves as a metadata preparation layer within the project-centric architecture. Future development will connect this foundation more deeply with collections, Shelby storage, project validation, publication, batch generation, versioning, and mint-ready asset workflows.