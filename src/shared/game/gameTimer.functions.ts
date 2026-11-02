import type { GameClock } from '@/shared/game/gameTimer.types'

export function elapsedAt({ clock, now }: { clock: GameClock; now: number }) {
  return clock.since === 0
    ? clock.accumulatedMs
    : clock.accumulatedMs + Math.max(0, now - clock.since)
}
