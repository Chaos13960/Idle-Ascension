export interface GeneratorDef {
  id: string
  name: string
  icon: string
  description: string
  baseCost: number
  costGrowth: number
  baseProduction: number
}

export interface GameState {
  essence: number
  totalEssence: number
  generators: Record<string, number>
  ascensionPoints: number
  ascensionCount: number
  lastTick: number
}
