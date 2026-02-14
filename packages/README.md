# VarunaX - Browser OS

A production-ready browser-based operating system with integrated financial research and trading capabilities.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Run type check
npm run typecheck
```

## Packages

| Package | Description |
|---------|-------------|
| `@varunax/design-tokens` | Design system with CSS variables |
| `@varunax/window-manager` | Window system, dock, menu bar |
| `@varunax/dexter` | Financial research client |
| `@varunax/trading` | Paper trading system |

## Development

```bash
# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Architecture

- **Window Manager**: Zustand store + React components for OS-like experience
- **Dexter**: Mock financial data client for development
- **Trading**: Paper trading with position sizing & audit logging

## License

MIT
