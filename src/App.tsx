import { GENERATORS } from './game/types'
import {
  canAscend,
  clickPower,
  generatorCost,
  pendingShards,
  productionPerSecond,
  shardMultiplier,
} from './game/engine'
import { formatNumber } from './game/format'
import { useGame } from './game/useGame'

export default function App() {
  const { state, channel, buy, ascend, reset } = useGame()
  const perSecond = productionPerSecond(state)
  const pending = pendingShards(state)
  const multiplier = shardMultiplier(state.shards)

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Idle Ascension</h1>
        <p className="tagline">Channel essence, build your order, ascend to power.</p>
      </header>

      <section className="resource-panel">
        <div className="essence-display">
          <span className="essence-value" data-testid="essence">
            {formatNumber(state.essence)}
          </span>
          <span className="essence-label">Essence</span>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-value" data-testid="per-second">
              {formatNumber(perSecond)}/s
            </span>
            <span className="stat-label">Production</span>
          </div>
          <div className="stat">
            <span className="stat-value">{formatNumber(state.shards)}</span>
            <span className="stat-label">Ascension Shards</span>
          </div>
          <div className="stat">
            <span className="stat-value">×{multiplier.toFixed(2)}</span>
            <span className="stat-label">Shard Bonus</span>
          </div>
          <div className="stat">
            <span className="stat-value">{state.ascensions}</span>
            <span className="stat-label">Ascensions</span>
          </div>
        </div>
        <button className="channel-button" onClick={channel} data-testid="channel">
          Channel Essence
          <span className="channel-power">+{formatNumber(clickPower(state))}</span>
        </button>
      </section>

      <section className="generators">
        <h2 className="section-heading">Generators</h2>
        <div className="generator-grid">
          {GENERATORS.map((def) => {
            const owned = state.owned[def.id] ?? 0
            const cost = generatorCost(def, owned)
            const affordable = state.essence >= cost
            return (
              <button
                key={def.id}
                className={`generator-card${affordable ? '' : ' disabled'}`}
                onClick={() => buy(def.id)}
                disabled={!affordable}
                data-testid={`buy-${def.id}`}
              >
                <div className="generator-head">
                  <span className="generator-name">{def.name}</span>
                  <span className="generator-owned" data-testid={`owned-${def.id}`}>
                    ×{owned}
                  </span>
                </div>
                <p className="generator-desc">{def.description}</p>
                <div className="generator-foot">
                  <span className="generator-prod">
                    {formatNumber(def.baseProduction * multiplier)}/s each
                  </span>
                  <span className="generator-cost" data-testid={`cost-${def.id}`}>
                    {formatNumber(cost)} essence
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="ascension">
        <h2 className="section-heading">Ascension</h2>
        <p className="ascension-desc">
          Reset your essence and generators to earn permanent shards. Each shard grants a
          <strong> +2% </strong> production bonus forever.
        </p>
        <div className="ascension-row">
          <button
            className="ascend-button"
            onClick={ascend}
            disabled={!canAscend(state)}
            data-testid="ascend"
          >
            Ascend for {formatNumber(pending)} shard{pending === 1 ? '' : 's'}
          </button>
          <button className="reset-button" onClick={reset} data-testid="reset">
            Reset All Progress
          </button>
        </div>
      </section>

      <footer className="footer">
        <span>Progress saves automatically. Offline production is granted on return.</span>
      </footer>
    </div>
  )
}
