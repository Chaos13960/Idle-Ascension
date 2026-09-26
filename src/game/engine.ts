import { GENERATORS, GeneratorDef, GameState } from './types'

/** Essence earned per manual "channel" click, scaled by ascension bonus. */
export const BASE_CLICK_POWER = 1

export function createInitialState(now: number = Date.now()): GameState {
  const owned: Record<string, number> = {}
  for (const g of GENERATORS) owned[g.id] = 0
  return {
    essence: 0,
    totalEssence: 0,
    shards: 0,
    ascensions: 0,
    owned,
    lastTick: now,
  }
}

/** Permanent production multiplier granted by ascension shards (+2% each). */
export function shardMultiplier(shards: number): number {
  return 1 + shards * 0.02
}

/** Cost of buying the next unit of a generator, given how many are owned. */
export function generatorCost(def: GeneratorDef, owned: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costGrowth, owned))
}

/** Total essence produced per second across all generators, with multipliers. */
export function productionPerSecond(state: GameState): number {
  const mult = shardMultiplier(state.shards)
  let total = 0
  for (const def of GENERATORS) {
    total += def.baseProduction * (state.owned[def.id] ?? 0)
  }
  return total * mult
}

/** Essence gained per manual click, scaled by ascension multiplier. */
export function clickPower(state: GameState): number {
  return BASE_CLICK_POWER * shardMultiplier(state.shards)
}

/** Shards the player would gain by ascending right now. */
export function pendingShards(state: GameState): number {
  // Diminishing returns: shards scale with the square root of total essence.
  return Math.floor(Math.sqrt(state.totalEssence / 1000))
}

export function canAscend(state: GameState): boolean {
  return pendingShards(state) > 0
}

/** Apply a manual channel click. Returns a new state. */
export function channel(state: GameState): GameState {
  const gain = clickPower(state)
  return {
    ...state,
    essence: state.essence + gain,
    totalEssence: state.totalEssence + gain,
  }
}

/** Buy one unit of a generator if affordable. Returns a new state (unchanged if not affordable). */
export function buyGenerator(state: GameState, id: string): GameState {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return state
  const owned = state.owned[id] ?? 0
  const cost = generatorCost(def, owned)
  if (state.essence < cost) return state
  return {
    ...state,
    essence: state.essence - cost,
    owned: { ...state.owned, [id]: owned + 1 },
  }
}

/** Advance the simulation by `deltaSeconds`. Returns a new state. */
export function tick(state: GameState, deltaSeconds: number, now: number = Date.now()): GameState {
  if (deltaSeconds <= 0) return { ...state, lastTick: now }
  const gain = productionPerSecond(state) * deltaSeconds
  return {
    ...state,
    essence: state.essence + gain,
    totalEssence: state.totalEssence + gain,
    lastTick: now,
  }
}

/** Perform an ascension: bank shards, reset run progress, keep permanent shards. */
export function ascend(state: GameState, now: number = Date.now()): GameState {
  const gained = pendingShards(state)
  if (gained <= 0) return state
  const owned: Record<string, number> = {}
  for (const g of GENERATORS) owned[g.id] = 0
  return {
    essence: 0,
    totalEssence: 0,
    shards: state.shards + gained,
    ascensions: state.ascensions + 1,
    owned,
    lastTick: now,
  }
}
