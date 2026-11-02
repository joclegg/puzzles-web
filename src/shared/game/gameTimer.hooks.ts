import { useEffect, useState } from 'react'

const TICK_MS = 500

export function useGameTimer({
  initialMs,
  running,
}: {
  initialMs: number
  running: boolean
}): () => number {
  const [timer, setTimer] = useState({ accumulated: initialMs, since: 0 })
  const [, setTick] = useState(0)

  useEffect(() => {
    if (!running) {
      return
    }
    function resume() {
      setTimer((current) =>
        current.since === 0
          ? { ...current, since: performance.now() }
          : current,
      )
    }
    function pause() {
      setTimer((current) =>
        current.since === 0
          ? current
          : {
              accumulated:
                current.accumulated + performance.now() - current.since,
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
    const interval = window.setInterval(
      () => setTick((tick) => tick + 1),
      TICK_MS,
    )
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      pause()
    }
  }, [running])

  return () =>
    timer.since === 0
      ? timer.accumulated
      : timer.accumulated + performance.now() - timer.since
}
