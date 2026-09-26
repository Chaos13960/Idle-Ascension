import { useCallback, useEffect, useRef, useState } from 'react'
import { GameState } from './types'
import {
  ascend as ascendState,
  buyGenerator as buyGeneratorState,
  channel as channelState,
  tick as tickState,
} from './engine'
import { loadState, saveState, clearSave } from './storage'

const TICK_MS = 100
const SAVE_MS = 5000

export interface GameApi {
  state: GameState
  channel: () => void
  buy: (id: string) => void
  ascend: () => void
  reset: () => void
}

export function useGame(): GameApi {
  const [state, setState] = useState<GameState>(() => {
    const loaded = loadState()
    // Apply offline progress based on time since last save.
    const now = Date.now()
    const offlineSeconds = Math.max(0, (now - loaded.lastTick) / 1000)
    return tickState(loaded, offlineSeconds, now)
  })

  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const tickTimer = window.setInterval(() => {
      setState((prev) => tickState(prev, TICK_MS / 1000))
    }, TICK_MS)
    const saveTimer = window.setInterval(() => {
      saveState(stateRef.current)
    }, SAVE_MS)
    const onUnload = () => saveState(stateRef.current)
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.clearInterval(tickTimer)
      window.clearInterval(saveTimer)
      window.removeEventListener('beforeunload', onUnload)
      saveState(stateRef.current)
    }
  }, [])

  const channel = useCallback(() => setState((prev) => channelState(prev)), [])
  const buy = useCallback((id: string) => setState((prev) => buyGeneratorState(prev, id)), [])
  const ascend = useCallback(() => setState((prev) => ascendState(prev)), [])
  const reset = useCallback(() => {
    clearSave()
    setState(loadState())
  }, [])

  return { state, channel, buy, ascend, reset }
}
