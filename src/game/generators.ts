import type { GeneratorDef } from './types'

/**
 * Ordered list of generators the player can purchase. Each successive tier is
 * far more expensive but produces dramatically more Essence, which creates the
 * classic idle "unlock the next tier" progression loop.
 */
export const GENERATORS: GeneratorDef[] = [
  {
    id: 'apprentice',
    name: 'Apprentice',
    icon: '🧑‍🎓',
    description: 'A humble student channeling faint wisps of Essence.',
    baseCost: 10,
    costGrowth: 1.15,
    baseProduction: 0.2,
  },
  {
    id: 'acolyte',
    name: 'Acolyte',
    icon: '🧙',
    description: 'A devoted acolyte weaving steady streams of Essence.',
    baseCost: 120,
    costGrowth: 1.16,
    baseProduction: 2.4,
  },
  {
    id: 'shrine',
    name: 'Shrine',
    icon: '⛩️',
    description: 'A sacred shrine that radiates Essence day and night.',
    baseCost: 1_500,
    costGrowth: 1.17,
    baseProduction: 28,
  },
  {
    id: 'leyline',
    name: 'Leyline',
    icon: '🌀',
    description: 'A tapped leyline funnelling raw power from the earth.',
    baseCost: 22_000,
    costGrowth: 1.18,
    baseProduction: 340,
  },
  {
    id: 'celestial',
    name: 'Celestial Gate',
    icon: '🌌',
    description: 'A rift to the heavens pouring out cosmic Essence.',
    baseCost: 350_000,
    costGrowth: 1.19,
    baseProduction: 4_200,
  },
]

export const GENERATORS_BY_ID: Record<string, GeneratorDef> = Object.fromEntries(
  GENERATORS.map((g) => [g.id, g]),
)
