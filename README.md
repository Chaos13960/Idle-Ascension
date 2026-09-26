# Idle Ascension

An idle / incremental web game built with **React + TypeScript + Vite**. Channel essence,
build an order of generators that produce essence automatically, and **ascend** to bank
permanent shards that make every future run stronger.

## Gameplay

- **Channel Essence** — click to earn essence manually (scaled by your ascension bonus).
- **Generators** — buy Acolytes, Shrines, Astral Conduits, and Ascension Nexuses that
  produce essence per second. Costs grow geometrically as you buy more.
- **Ascension** — reset your essence and generators in exchange for permanent shards.
  Each shard grants a **+2%** production bonus forever. Shards earned scale with the
  square root of total essence earned this run.
- **Persistence** — progress saves to `localStorage` automatically, and offline production
  is granted when you return.

## Getting started

Requirements: Node.js 22+ and npm.

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (host `0.0.0.0`, port `5173`). |
| `npm run build` | Type-check and produce a production build in `dist/`. |
| `npm run preview` | Serve the production build locally (port `4173`). |
| `npm run lint` | Run ESLint over the project. |
| `npm test` | Run the Vitest unit + component test suite. |
| `npm run test:watch` | Run tests in watch mode. |

## Project structure

```
src/
  App.tsx            # Root UI: resource panel, generators, ascension controls
  main.tsx           # React entry point
  styles.css         # App styling (dark, neon theme)
  game/
    types.ts         # Game state types and generator definitions
    engine.ts        # Pure game logic (production, costs, ascension)
    storage.ts       # localStorage save/load with validation
    format.ts        # Short-scale number formatting (K/M/B/...)
    useGame.ts       # React hook driving the game loop
  test/setup.ts      # Test setup (jest-dom matchers)
```

The core game logic in `src/game/engine.ts` is written as pure functions, which keeps it
fully unit-testable independent of React.

## Cloud Agent environment

This repository is configured for Cursor Cloud Agents via `.cursor/environment.json`:

- `install`: `npm install`
- `terminals`: runs `npm run dev` so the dev server is available while an agent works.
