# Limitations & Roadmap

Shelby Studio is an evolving developer and creator workspace built around Shelby storage.

This page describes what is currently supported, what still has limitations, and the areas planned for future development.

## Current Status

### Storage

- Shelby storage integration
- File uploads
- File downloads
- Asset listing
- Asset inspection
- Object metadata inspection
- Asset deletion
- Asset replacement
- Storage location information

### Explorer

The Explorer provides a read-oriented interface for discovering and inspecting available assets.

It supports asset search, filtering, sorting and detailed asset inspection where the underlying Shelby information is available.

### Metadata

Shelby Studio provides tools for creating and managing NFT metadata.

Metadata can be associated with assets stored through the Shelby workflow and exported for use in external applications and NFT workflows.

### Collections

Collection tooling provides a workspace for organizing NFT-related metadata and assets.

### Developer Platform

The Developer workspace currently includes:

- API Playground
- SDK Explorer
- Code Generator
- Integration Examples
- Developer documentation

## Important Limitations

### Network Availability

Shelby Studio depends on the Shelby network and services configured by the application.

Availability and supported functionality may therefore depend on the configured Shelby environment.

### Wallet-Dependent Operations

Some operations require a connected wallet because they involve signing or submitting blockchain transactions.

Read-only exploration and documentation do not require a wallet.

### API Configuration

Some Shelby operations are backed by server-side configuration.

Private credentials must remain server-side.

### Browser Upload Configuration

The browser upload workflow uses the Shelby browser SDK and the application's configured upload pipeline.

Browser-visible configuration must never contain private administrative credentials.

### Storage Quota

Shelby Studio does not display an invented account quota.

Storage usage shown by the application should represent data that can actually be measured from the connected or configured storage environment.

No fixed quota should be assumed unless the underlying Shelby service provides one.

### Production Readiness

Some parts of Shelby Studio are still evolving.

Developers should verify the behavior of the configured Shelby network and application environment before using the platform as a production dependency.

## What Shelby Studio Does Not Claim

Shelby Studio does not claim:

- A fixed storage quota unless one is provided by the underlying service
- A specific number of stored assets
- A specific number of developers
- Guaranteed uptime statistics
- Network performance statistics that have not been measured
- Production readiness for functionality that is still being developed

Product status should be based on actual implemented functionality rather than invented statistics.

## Roadmap

### Developer Experience

Planned improvements include:

- More SDK operations exposed through the developer workspace
- More complete API coverage
- Additional integration examples
- Improved code generation
- Better developer onboarding

### Storage

Future storage improvements may include:

- More storage management capabilities
- More detailed storage information
- Improved asset management workflows
- Additional Shelby storage operations

### Explorer

Future Explorer improvements may include:

- More powerful discovery
- Improved asset inspection
- More detailed object information
- Additional filtering and organization capabilities

### Metadata & Collections

Future improvements may include:

- Expanded metadata workflows
- More collection management capabilities
- Improved validation
- Better export workflows
- Additional NFT tooling

### Documentation

Documentation will continue to expand around:

- API usage
- SDK operations
- Architecture
- Integration patterns
- Examples
- Changelog and release information

## Status Labels

**Available**

Implemented and currently accessible in Shelby Studio.

**In Development**

Actively being improved or expanded.

**Planned**

Identified as a future improvement but not currently available.

## How to Follow Development

The Developer workspace and documentation provide the current implementation surface.

For the latest supported functionality, developers should use the available API Playground, SDK Explorer, Code Generator and documentation rather than relying on roadmap items that have not yet been implemented.

## Next

If you are new to Shelby Studio, start with:

1. Introduction
2. Quick Start
3. Developer Platform
4. API Playground
5. SDK Explorer
6. Examples
7. Architecture

Then move into the storage and metadata documentation for deeper integration work.
