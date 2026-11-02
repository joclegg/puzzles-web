import { formatDuration } from '@/shared/lib/format.functions'

export function GameStatusBar({
  elapsedMs,
  progressPercent,
  showTimer,
  showProgress,
}: {
  elapsedMs: number
  progressPercent: number | null
  showTimer: boolean
  showProgress: boolean
}) {
  return (
    <p className="flex gap-3 text-sm text-muted-foreground tabular-nums">
      {showTimer && (
        <span role="timer" aria-label="Time">
          {formatDuration(elapsedMs)}
        </span>
      )}
      {showProgress && progressPercent !== null && (
        <span aria-label="Progress">{progressPercent}%</span>
      )}
    </p>
  )
}
