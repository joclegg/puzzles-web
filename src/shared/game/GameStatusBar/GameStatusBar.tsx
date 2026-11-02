import { ElapsedTime } from '@/shared/game/ElapsedTime/ElapsedTime'
import type { GameClock } from '@/shared/game/gameTimer.types'

export function GameStatusBar({
  clock,
  progressPercent,
  showTimer,
  showProgress,
}: {
  clock: GameClock
  progressPercent: number | null
  showTimer: boolean
  showProgress: boolean
}) {
  return (
    <p className="flex gap-3 text-sm text-muted-foreground tabular-nums">
      {showTimer && (
        <span role="timer" aria-label="Time">
          <ElapsedTime clock={clock} />
        </span>
      )}
      {showProgress && progressPercent !== null && (
        <span aria-label="Progress">{progressPercent}%</span>
      )}
    </p>
  )
}
