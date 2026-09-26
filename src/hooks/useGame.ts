import { useCallback, useEffect, useRef, useState } from 'react'
import {
  applyTick,
  ascend as ascendState,
  buyGenerator,
  channel as channelState,
  createInitialState,
} from '../game/engine'
import { clearSave, loadState, saveState } from '../game/storage'
import type { GameState } from '../game/types'

const TICK_MS = 100
const SAVE_MS = 5_000

export interface UseGame {
  state: GameState
  channel: () => void
  buy: (id: string) => void
  ascend: () => void
  reset: () => void
}

export function useGame(): UseGame {
  const [state, setState] = useState<GameState>(() => {
    const loaded = loadState()
    // Credit Essence earned while the tab was closed (offline progress).
    const elapsed = Math.max(0, (Date.now() - loaded.lastTick) / 1000)
    return applyTick(loaded, Math.min(elapsed, 60 * 60 * 8))
  })

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const tick = setInterval(() => {
      setState((prev) => {
        const now = Date.now()
        const dt = (now - prev.lastTick) / 1000
        return applyTick(prev, dt, now)
      })
    }, TICK_MS)

    const save = setInterval(() => saveState(stateRef.current), SAVE_MS)
    const onUnload = () => saveState(stateRef.current)
    window.addEventListener('beforeunload', onUnload)

    return () => {
      clearInterval(tick)
      clearInterval(save)
      window.removeEventListener('beforeunload', onUnload)
      saveState(stateRef.current)
    }
  }, [])

  const channel = useCallback(() => {
    setState((prev) => channelState(prev))
  }, [])

  const buy = useCallback((id: string) => {
    setState((prev) => buyGenerator(prev, id))
  }, [])

  const ascend = useCallback(() => {
    setState((prev) => ascendState(prev))
  }, [])

  const reset = useCallback(() => {
    clearSave()
    setState(createInitialState())
  }, [])

  return { state, channel, buy, ascend, reset }
}
