import { useMemo, useState } from 'react'
import './App.css'
import { GeneratorRow } from './components/GeneratorRow'
import {
  ASCENSION_THRESHOLD,
  ascensionMultiplier,
  canAscend,
  pendingAscensionPoints,
  productionPerSecond,
} from './game/engine'
import { formatNumber, formatRate } from './game/format'
import { GENERATORS } from './game/generators'
import { useGame } from './hooks/useGame'

export default function App() {
  const { state, channel, buy, ascend, reset } = useGame()
  const [confirmingReset, setConfirmingReset] = useState(false)

  const rate = useMemo(() => productionPerSecond(state), [state])
  const pending = pendingAscensionPoints(state)
  const mult = ascensionMultiplier(state)
  const ascendReady = canAscend(state)
  const progress = Math.min(1, state.totalEssence / ASCENSION_THRESHOLD)

  return (
    <div className="app">
      <div className="starfield" aria-hidden />
      <header className="app__header">
        <h1 className="app__title">
          Idle<span className="app__title-accent">·</span>Ascension
        </h1>
        <p className="app__tagline">Channel Essence. Build your order. Ascend beyond.</p>
      </header>

      <section className="essence-panel">
        <div className="essence-panel__amount" data-testid="essence">
          {formatNumber(state.essence)}
        </div>
        <div className="essence-panel__label">Essence</div>
        <div className="essence-panel__rate" data-testid="rate">
          {formatRate(rate)}
        </div>
        <button className="channel-button" onClick={channel} data-testid="channel">
          <span className="channel-button__spark" aria-hidden>
            ✦
          </span>
          Channel Essence
        </button>
      </section>

      <section className="ascension" aria-label="Ascension">
        <div className="ascension__stats">
          <div className="stat">
            <span className="stat__value">{formatNumber(state.ascensionPoints)}</span>
            <span className="stat__label">Ascension Points</span>
          </div>
          <div className="stat">
            <span className="stat__value">×{mult.toFixed(1)}</span>
            <span className="stat__label">Production Bonus</span>
          </div>
          <div className="stat">
            <span className="stat__value">{state.ascensionCount}</span>
            <span className="stat__label">Ascensions</span>
          </div>
        </div>

        <div className="ascension__progress">
          <div className="ascension__progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>

        <button
          className="ascend-button"
          onClick={ascend}
          disabled={!ascendReady}
          data-testid="ascend"
        >
          {ascendReady ? (
            <>Ascend for <strong>+{formatNumber(pending)}</strong> AP</>
          ) : (
            <>Reach {formatNumber(ASCENSION_THRESHOLD)} lifetime Essence to Ascend</>
          )}
        </button>
      </section>

      <section className="generators" aria-label="Generators">
        <h2 className="section-title">Generators</h2>
        {GENERATORS.map((gen) => (
          <GeneratorRow key={gen.id} gen={gen} state={state} onBuy={buy} />
        ))}
      </section>

      <footer className="app__footer">
        {confirmingReset ? (
          <span className="reset-confirm">
            Erase all progress?
            <button
              className="link-button danger"
              onClick={() => {
                reset()
                setConfirmingReset(false)
              }}
            >
              Yes, reset
            </button>
            <button className="link-button" onClick={() => setConfirmingReset(false)}>
              Cancel
            </button>
          </span>
        ) : (
          <button className="link-button" onClick={() => setConfirmingReset(true)}>
            Reset game
          </button>
        )}
      </footer>
    </div>
  )
}
