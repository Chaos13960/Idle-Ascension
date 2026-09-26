import { describe, expect, it } from 'vitest'
import {
  ASCENSION_THRESHOLD,
  applyTick,
  ascend,
  ascensionMultiplier,
  bulkCost,
  buyGenerator,
  canAscend,
  createInitialState,
  generatorCost,
  maxAffordable,
  pendingAscensionPoints,
  productionPerSecond,
} from './engine'
import { GENERATORS_BY_ID } from './generators'

describe('generatorCost', () => {
  it('returns the base cost for the first unit', () => {
    expect(generatorCost(GENERATORS_BY_ID.apprentice, 0)).toBe(10)
  })

  it('grows geometrically with ownership', () => {
    const gen = GENERATORS_BY_ID.apprentice
    expect(generatorCost(gen, 1)).toBe(Math.ceil(10 * 1.15))
    expect(generatorCost(gen, 5)).toBe(Math.ceil(10 * Math.pow(1.15, 5)))
  })
})

describe('bulkCost', () => {
  it('matches the sum of sequential single costs', () => {
    const gen = GENERATORS_BY_ID.apprentice
    let sum = 0
    for (let i = 0; i < 10; i++) sum += generatorCost(gen, i)
    // Closed form rounds once at the end, so allow tiny rounding drift.
    expect(Math.abs(bulkCost(gen, 0, 10) - sum)).toBeLessThanOrEqual(10)
  })

  it('is zero for non-positive amounts', () => {
    expect(bulkCost(GENERATORS_BY_ID.apprentice, 3, 0)).toBe(0)
  })
})

describe('buyGenerator', () => {
  it('deducts Essence and increments ownership when affordable', () => {
    const state = { ...createInitialState(), essence: 100 }
    const next = buyGenerator(state, 'apprentice')
    expect(next.generators.apprentice).toBe(1)
    expect(next.essence).toBe(90)
  })

  it('is a no-op when the player cannot afford it', () => {
    const state = { ...createInitialState(), essence: 5 }
    const next = buyGenerator(state, 'apprentice')
    expect(next).toBe(state)
  })

  it('ignores unknown generator ids', () => {
    const state = { ...createInitialState(), essence: 1000 }
    expect(buyGenerator(state, 'nope')).toBe(state)
  })
})

describe('maxAffordable', () => {
  it('reports how many units fit the current balance', () => {
    const state = { ...createInitialState(), essence: 100 }
    // bulkCost(0..6) ≈ 88 ≤ 100 < bulkCost(0..7) ≈ 111 => 6 affordable.
    expect(maxAffordable(state, 'apprentice')).toBe(6)
    expect(maxAffordable({ ...createInitialState(), essence: 9 }, 'apprentice')).toBe(0)
  })
})

describe('production and ticking', () => {
  it('sums production across generators with the ascension multiplier', () => {
    const state = {
      ...createInitialState(),
      generators: { ...createInitialState().generators, apprentice: 10 },
      ascensionPoints: 5,
    }
    // 10 * 0.2 = 2 base, ×(1 + 5*0.1)=1.5 => 3/s
    expect(ascensionMultiplier(state)).toBeCloseTo(1.5)
    expect(productionPerSecond(state)).toBeCloseTo(3)
  })

  it('accrues Essence over elapsed time', () => {
    const base = {
      ...createInitialState(0),
      generators: { ...createInitialState().generators, apprentice: 10 },
    }
    const next = applyTick(base, 10, 10_000)
    expect(next.essence).toBeCloseTo(20) // 2/s * 10s
    expect(next.totalEssence).toBeCloseTo(20)
    expect(next.lastTick).toBe(10_000)
  })
})

describe('ascension', () => {
  it('is unavailable below the threshold', () => {
    const state = { ...createInitialState(), totalEssence: ASCENSION_THRESHOLD - 1 }
    expect(canAscend(state)).toBe(false)
    expect(pendingAscensionPoints(state)).toBe(0)
  })

  it('awards points on a square-root curve', () => {
    const state = { ...createInitialState(), totalEssence: ASCENSION_THRESHOLD * 9 }
    expect(pendingAscensionPoints(state)).toBe(3)
  })

  it('banks points and resets the run', () => {
    const state = {
      ...createInitialState(),
      essence: 5_000,
      totalEssence: ASCENSION_THRESHOLD * 4,
      generators: { ...createInitialState().generators, apprentice: 25 },
      ascensionPoints: 1,
      ascensionCount: 2,
    }
    const next = ascend(state, 42)
    expect(next.ascensionPoints).toBe(3) // 1 existing + 2 gained
    expect(next.ascensionCount).toBe(3)
    expect(next.essence).toBe(0)
    expect(next.generators.apprentice).toBe(0)
    expect(next.lastTick).toBe(42)
  })

  it('is a no-op when nothing would be gained', () => {
    const state = createInitialState()
    expect(ascend(state)).toBe(state)
  })
})
