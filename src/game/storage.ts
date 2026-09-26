import { createInitialState } from './engine'
import { GENERATORS } from './generators'
import type { GameState } from './types'

const SAVE_KEY = 'idle-ascension:save:v1'

/** Merge a parsed save with defaults so new generators never break old saves. */
function normalize(raw: Partial<GameState>): GameState {
  const base = createInitialState()
  const generators = { ...base.generators }
  if (raw.generators) {
    for (const gen of GENERATORS) {
      const owned = raw.generators[gen.id]
      if (typeof owned === 'number' && Number.isFinite(owned) && owned >= 0) {
        generators[gen.id] = Math.floor(owned)
      }
    }
  }
  return {
    essence: numberOr(raw.essence, 0),
    totalEssence: numberOr(raw.totalEssence, 0),
    generators,
    ascensionPoints: numberOr(raw.ascensionPoints, 0),
    ascensionCount: numberOr(raw.ascensionCount, 0),
    lastTick: numberOr(raw.lastTick, Date.now()),
  }
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function loadState(): GameState {
  if (typeof localStorage === 'undefined') return createInitialState()
  try {
    const stored = localStorage.getItem(SAVE_KEY)
    if (!stored) return createInitialState()
    return normalize(JSON.parse(stored) as Partial<GameState>)
  } catch {
    return createInitialState()
  }
}

export function saveState(state: GameState): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    // Ignore quota / serialization errors — the game keeps running in memory.
  }
}

export function clearSave(): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // ignore
  }
}
