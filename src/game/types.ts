export interface GeneratorDef {
  id: string
  name: string
  description: string
  /** Base cost in essence for the first unit. */
  baseCost: number
  /** Multiplicative cost growth per owned unit. */
  costGrowth: number
  /** Essence produced per second per unit (before multipliers). */
  baseProduction: number
}

export interface GameState {
  /** Current spendable essence. */
  essence: number
  /** Total essence earned this ascension run (drives ascension rewards). */
  totalEssence: number
  /** Permanent ascension shards earned across all runs. */
  shards: number
  /** Number of times the player has ascended. */
  ascensions: number
  /** Owned count per generator id. */
  owned: Record<string, number>
  /** Timestamp (ms) of the last tick, used for offline progress. */
  lastTick: number
}

export const GENERATORS: GeneratorDef[] = [
  {
    id: 'acolyte',
    name: 'Acolyte',
    description: 'A devoted follower channeling faint essence.',
    baseCost: 10,
    costGrowth: 1.15,
    baseProduction: 0.2,
  },
  {
    id: 'shrine',
    name: 'Shrine',
    description: 'A sacred site that steadily radiates essence.',
    baseCost: 120,
    costGrowth: 1.17,
    baseProduction: 2,
  },
  {
    id: 'conduit',
    name: 'Astral Conduit',
    description: 'Draws raw essence from the astral plane.',
    baseCost: 1500,
    costGrowth: 1.2,
    baseProduction: 22,
  },
  {
    id: 'nexus',
    name: 'Ascension Nexus',
    description: 'A reality-bending engine of pure creation.',
    baseCost: 20000,
    costGrowth: 1.23,
    baseProduction: 240,
  },
]
