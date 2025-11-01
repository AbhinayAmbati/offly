# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Offly - offline-first web app plugin
- CLI commands: `Offly init` and `Offly build`
- Runtime library with fetch wrapper, cache manager, and sync manager
- React hooks: `useOfflineData`, `useOfflinePost`, `useSyncStatus`, `useCacheStats`
- Service worker template generation with asset caching and background sync
- IndexedDB integration using Dexie.js for data persistence
- TypeScript support with full type definitions
- Automatic project scanning for assets and API endpoints
- Configurable caching strategies (cache-first, network-first)
- Background sync for failed requests
- Network status detection and handling

### Features
- ðŸ—‚ï¸ Automatic asset caching for static files
- ðŸ’¾ Offline data persistence with IndexedDB
- ðŸ”„ Background sync for queued requests
- âš¡ Simple React hooks for offline data management
- ðŸ§° CLI tools for easy setup and build integration
- ðŸŒ Service worker generation with pre-configured caching
- ðŸ“¦ Zero configuration with sensible defaults
- ðŸŽ¯ Multiple caching strategies support
- ðŸ› ï¸ Framework agnostic (React, Vue, Vanilla JS support)

## [0.1.0] - 2025-11-01

### Added
- Initial MVP release
- Core offline-first functionality
- CLI tooling for project initialization
- React hooks for seamless integration
- Service worker template with caching strategies
- Background sync for offline request queuing
- TypeScript support and type definitions
- Comprehensive documentation and examples

### Technical Details
- Built with TypeScript and Vite
- Uses Dexie.js for IndexedDB operations
- Commander.js for CLI interface
- Supports ES modules and CommonJS
- Comprehensive test suite with Vitest
- ESLint and Prettier for code quality
