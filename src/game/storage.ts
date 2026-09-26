import { GENERATORS, GameState } from './types'
import { createInitialState } from './engine'

const SAVE_KEY = 'idle-ascension-save-v1'

/** Load a saved game from localStorage, migrating/validating fields. */
export function loadState(now: number = Date.now()): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return createInitialState(now)
    const parsed = JSON.parse(raw) as Partial<GameState>
    const base = createInitialState(now)
    const owned: Record<string, number> = { ...base.owned }
    if (parsed.owned && typeof parsed.owned === 'object') {
      for (const g of GENERATORS) {
        const v = parsed.owned[g.id]
        if (typeof v === 'number' && Number.isFinite(v) && v >= 0) owned[g.id] = Math.floor(v)
      }
    }
    return {
      essence: numberOr(parsed.essence, 0),
      totalEssence: numberOr(parsed.totalEssence, 0),
      shards: numberOr(parsed.shards, 0),
      ascensions: numberOr(parsed.ascensions, 0),
      owned,
      lastTick: numberOr(parsed.lastTick, now),
    }
  } catch {
    return createInitialState(now)
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable (private mode / quota); ignore.
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // ignore
  }
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}
