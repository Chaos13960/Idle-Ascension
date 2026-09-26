import { describe, expect, it } from 'vitest'
import { GENERATORS } from './types'
import {
  ascend,
  buyGenerator,
  canAscend,
  channel,
  clickPower,
  createInitialState,
  generatorCost,
  pendingShards,
  productionPerSecond,
  shardMultiplier,
  tick,
} from './engine'

describe('createInitialState', () => {
  it('starts empty with zeroed generators', () => {
    const s = createInitialState(0)
    expect(s.essence).toBe(0)
    expect(s.totalEssence).toBe(0)
    expect(s.shards).toBe(0)
    for (const g of GENERATORS) expect(s.owned[g.id]).toBe(0)
  })
})

describe('channel', () => {
  it('adds click power to essence and total', () => {
    const s = channel(createInitialState(0))
    expect(s.essence).toBe(1)
    expect(s.totalEssence).toBe(1)
  })

  it('scales with shard multiplier', () => {
    const base = { ...createInitialState(0), shards: 50 }
    expect(clickPower(base)).toBeCloseTo(2, 5)
    expect(channel(base).essence).toBeCloseTo(2, 5)
  })
})

describe('generatorCost', () => {
  it('grows geometrically with owned count', () => {
    const def = GENERATORS[0]
    expect(generatorCost(def, 0)).toBe(def.baseCost)
    expect(generatorCost(def, 1)).toBe(Math.floor(def.baseCost * def.costGrowth))
    expect(generatorCost(def, 5)).toBeGreaterThan(generatorCost(def, 4))
  })
})

describe('buyGenerator', () => {
  it('buys when affordable and deducts cost', () => {
    const acolyte = GENERATORS[0]
    let s = { ...createInitialState(0), essence: acolyte.baseCost }
    s = buyGenerator(s, acolyte.id)
    expect(s.owned[acolyte.id]).toBe(1)
    expect(s.essence).toBe(0)
  })

  it('does nothing when unaffordable', () => {
    const s = createInitialState(0)
    const after = buyGenerator(s, GENERATORS[0].id)
    expect(after).toEqual(s)
  })

  it('ignores unknown generators', () => {
    const s = { ...createInitialState(0), essence: 1e9 }
    expect(buyGenerator(s, 'does-not-exist')).toEqual(s)
  })
})

describe('productionPerSecond', () => {
  it('sums owned generators and applies shard bonus', () => {
    const acolyte = GENERATORS[0]
    const s = {
      ...createInitialState(0),
      owned: { ...createInitialState(0).owned, [acolyte.id]: 10 },
      shards: 50,
    }
    // 10 * baseProduction * (1 + 50*0.02 = 2)
    expect(productionPerSecond(s)).toBeCloseTo(10 * acolyte.baseProduction * 2, 5)
  })
})

describe('tick', () => {
  it('accrues production over time', () => {
    const acolyte = GENERATORS[0]
    const s = {
      ...createInitialState(0),
      owned: { ...createInitialState(0).owned, [acolyte.id]: 5 },
    }
    const after = tick(s, 10, 1000)
    expect(after.essence).toBeCloseTo(5 * acolyte.baseProduction * 10, 5)
    expect(after.lastTick).toBe(1000)
  })

  it('handles non-positive delta without production', () => {
    const s = createInitialState(0)
    const after = tick(s, 0, 500)
    expect(after.essence).toBe(0)
    expect(after.lastTick).toBe(500)
  })
})

describe('ascension', () => {
  it('grants shards based on sqrt of total essence', () => {
    const s = { ...createInitialState(0), totalEssence: 1_000_000 }
    // sqrt(1_000_000 / 1000) = sqrt(1000) ≈ 31.6 -> 31
    expect(pendingShards(s)).toBe(31)
    expect(canAscend(s)).toBe(true)
  })

  it('cannot ascend below the threshold', () => {
    const s = { ...createInitialState(0), totalEssence: 500 }
    expect(pendingShards(s)).toBe(0)
    expect(canAscend(s)).toBe(false)
    expect(ascend(s)).toEqual(s)
  })

  it('resets run progress and banks shards permanently', () => {
    const acolyte = GENERATORS[0]
    const s = {
      ...createInitialState(0),
      essence: 5000,
      totalEssence: 1_000_000,
      owned: { ...createInitialState(0).owned, [acolyte.id]: 12 },
    }
    const after = ascend(s, 2000)
    expect(after.essence).toBe(0)
    expect(after.totalEssence).toBe(0)
    expect(after.owned[acolyte.id]).toBe(0)
    expect(after.shards).toBe(31)
    expect(after.ascensions).toBe(1)
    expect(after.lastTick).toBe(2000)
  })
})

describe('shardMultiplier', () => {
  it('grants +2% per shard', () => {
    expect(shardMultiplier(0)).toBe(1)
    expect(shardMultiplier(10)).toBeCloseTo(1.2, 5)
  })
})
