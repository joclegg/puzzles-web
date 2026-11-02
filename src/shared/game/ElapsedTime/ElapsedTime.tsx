import { useEffect, useState } from 'react'

import { TICK_MS } from '@/shared/game/ElapsedTime/ElapsedTime.constants'
import { elapsedAt } from '@/shared/game/gameTimer.functions'
import type { GameClock } from '@/shared/game/gameTimer.types'
import { formatDuration } from '@/shared/lib/format.functions'

export function ElapsedTime({ clock }: { clock: GameClock }) {
  const [now, setNow] = useState(() => performance.now())
  const running = clock.since !== 0

  useEffect(() => {
    if (!running) {
      return
    }
    const interval = window.setInterval(
      () => setNow(performance.now()),
      TICK_MS,
    )
    return () => window.clearInterval(interval)
  }, [running])

  return formatDuration(elapsedAt({ clock, now }))
}
