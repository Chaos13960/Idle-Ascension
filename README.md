# Idle-Ascension

An idle / incremental web game about channelling **Essence**, building an order of
generators, and **ascending** for permanent power. Built with Vite + React +
TypeScript.

## Gameplay

- **Essence** accrues automatically from the generators you own.
- Buy generators (Apprentice → Acolyte → Shrine → Leyline → Celestial Gate); each
  tier costs more but produces far more Essence.
- Once you reach **1M lifetime Essence** you can **Ascend**: reset your run in
  exchange for **Ascension Points**, each granting a permanent **+10%** production
  bonus.
- Progress is saved to `localStorage`, including offline gains (up to 8 hours).

## Tech stack

- [Vite 8](https://vite.dev/) dev server & bundler
- [React 19](https://react.dev/) + TypeScript
- [Vitest](https://vitest.dev/) for unit tests
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
```

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start the Vite dev server (hot reload).      |
| `npm run build`  | Type-check and build the production bundle.  |
| `npm run preview`| Preview the production build locally.        |
| `npm run lint`   | Run oxlint.                                  |
| `npm test`       | Run the unit test suite once.                |
| `npm run test:watch` | Run tests in watch mode.                 |

## Project structure

```
src/
  game/        Pure, unit-tested game engine (state, costs, ascension, formatting)
  hooks/       React game loop + persistence hook
  components/  Presentational UI components
  App.tsx      Main game screen
```

## Cloud Agent environment

This repository ships a `.cursor/environment.json` so Cursor Cloud Agents boot with
dependencies installed and the dev server running on port 5173. See
[Cursor Cloud Agent docs](https://cursor.com/docs/cloud-agent/setup) for details.
