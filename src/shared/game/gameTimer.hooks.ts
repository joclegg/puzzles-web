import { useEffect, useState } from 'react'

import { elapsedAt } from '@/shared/game/gameTimer.functions'
import type { GameClock } from '@/shared/game/gameTimer.types'

export function useGameTimer({
  initialMs,
  running,
}: {
  initialMs: number
  running: boolean
}): { elapsedMs: () => number; clock: GameClock } {
  const [clock, setClock] = useState<GameClock>({
    accumulatedMs: initialMs,
    since: 0,
  })

  useEffect(() => {
    if (!running) {
      return
    }
    function resume() {
      setClock((current) =>
        current.since === 0
          ? { ...current, since: performance.now() }
          : current,
      )
    }
    function pause() {
      setClock((current) =>
        current.since === 0
          ? current
          : {
              accumulatedMs: elapsedAt({
                clock: current,
                now: performance.now(),
              }),
              since: 0,
            },
      )
    }
    function onVisibility() {
      if (document.hidden) {
        pause()
      } else {
        resume()
      }
    }
    resume()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      pause()
    }
  }, [running])

  return {
    elapsedMs: () => elapsedAt({ clock, now: performance.now() }),
    clock,
  }
}
