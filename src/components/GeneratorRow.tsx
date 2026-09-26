import { generatorCost } from '../game/engine'
import { formatNumber } from '../game/format'
import type { GameState, GeneratorDef } from '../game/types'

interface Props {
  gen: GeneratorDef
  state: GameState
  onBuy: (id: string) => void
}

export function GeneratorRow({ gen, state, onBuy }: Props) {
  const owned = state.generators[gen.id] ?? 0
  const cost = generatorCost(gen, owned)
  const affordable = state.essence >= cost
  const mult = 1 + state.ascensionPoints * 0.1
  const output = owned * gen.baseProduction * mult

  return (
    <button
      className={`generator${affordable ? ' affordable' : ''}`}
      onClick={() => onBuy(gen.id)}
      disabled={!affordable}
      aria-label={`Buy ${gen.name} for ${formatNumber(cost)} Essence`}
    >
      <span className="generator__icon" aria-hidden>
        {gen.icon}
      </span>
      <span className="generator__body">
        <span className="generator__title">
          {gen.name}
          <span className="generator__owned">×{owned}</span>
        </span>
        <span className="generator__desc">{gen.description}</span>
        <span className="generator__output">+{formatNumber(output)}/s</span>
      </span>
      <span className="generator__cost">
        <span className="generator__cost-label">Cost</span>
        <span className="generator__cost-value">{formatNumber(cost)}</span>
      </span>
    </button>
  )
}
