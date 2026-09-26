import { GENERATORS, GENERATORS_BY_ID } from './generators'
import type { GameState, GeneratorDef } from './types'

/** Lifetime Essence required before the first ascension becomes available. */
export const ASCENSION_THRESHOLD = 1_000_000

/** Each Ascension Point grants a permanent +10% boost to all production. */
export const ASCENSION_BONUS_PER_POINT = 0.1

export function createInitialState(now: number = Date.now()): GameState {
  return {
    essence: 0,
    totalEssence: 0,
    generators: Object.fromEntries(GENERATORS.map((g) => [g.id, 0])),
    ascensionPoints: 0,
    ascensionCount: 0,
    lastTick: now,
  }
}

/** Cost of buying the next single unit of a generator you already own `owned` of. */
export function generatorCost(gen: GeneratorDef, owned: number): number {
  return Math.ceil(gen.baseCost * Math.pow(gen.costGrowth, owned))
}

/** Total cost of buying `amount` sequential units starting from `owned`. */
export function bulkCost(gen: GeneratorDef, owned: number, amount: number): number {
  if (amount <= 0) return 0
  // Closed-form geometric series keeps large bulk buys exact and cheap.
  const { baseCost: b, costGrowth: r } = gen
  const raw = b * Math.pow(r, owned) * (Math.pow(r, amount) - 1) / (r - 1)
  return Math.ceil(raw)
}

/** Permanent production multiplier earned from ascension. */
export function ascensionMultiplier(state: GameState): number {
  return 1 + state.ascensionPoints * ASCENSION_BONUS_PER_POINT
}

/** Total Essence produced per second across every generator, after bonuses. */
export function productionPerSecond(state: GameState): number {
  const mult = ascensionMultiplier(state)
  let total = 0
  for (const gen of GENERATORS) {
    const owned = state.generators[gen.id] ?? 0
    total += owned * gen.baseProduction
  }
  return total * mult
}

/**
 * Ascension Points the player would receive by ascending right now. Uses a
 * square-root curve so early progress feels rewarding but later runs require
 * exponentially more Essence per point.
 */
export function pendingAscensionPoints(state: GameState): number {
  if (state.totalEssence < ASCENSION_THRESHOLD) return 0
  return Math.floor(Math.sqrt(state.totalEssence / ASCENSION_THRESHOLD))
}

export function canAscend(state: GameState): boolean {
  return pendingAscensionPoints(state) > 0
}

/** Advance the simulation by `dtSeconds`, accruing produced Essence. */
export function applyTick(state: GameState, dtSeconds: number, now: number = Date.now()): GameState {
  if (dtSeconds <= 0) return { ...state, lastTick: now }
  const produced = productionPerSecond(state) * dtSeconds
  return {
    ...state,
    essence: state.essence + produced,
    totalEssence: state.totalEssence + produced,
    lastTick: now,
  }
}

/** Buy a single generator if affordable; otherwise return the state unchanged. */
export function buyGenerator(state: GameState, id: string): GameState {
  const gen = GENERATORS_BY_ID[id]
  if (!gen) return state
  const owned = state.generators[id] ?? 0
  const cost = generatorCost(gen, owned)
  if (state.essence < cost) return state
  return {
    ...state,
    essence: state.essence - cost,
    generators: { ...state.generators, [id]: owned + 1 },
  }
}

/**
 * Largest number of units of `id` the player can currently afford, capped by
 * `max` so a single click cannot lock the UI on absurd quantities.
 */
export function maxAffordable(state: GameState, id: string, max = 1_000): number {
  const gen = GENERATORS_BY_ID[id]
  if (!gen) return 0
  const owned = state.generators[id] ?? 0
  let count = 0
  while (count < max && state.essence >= bulkCost(gen, owned, count + 1)) {
    count++
  }
  return count
}

/** Ascend: bank pending Ascension Points and reset the current run. */
export function ascend(state: GameState, now: number = Date.now()): GameState {
  const gained = pendingAscensionPoints(state)
  if (gained <= 0) return state
  const fresh = createInitialState(now)
  return {
    ...fresh,
    ascensionPoints: state.ascensionPoints + gained,
    ascensionCount: state.ascensionCount + 1,
  }
}
