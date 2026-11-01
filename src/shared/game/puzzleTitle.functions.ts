import { formatDayMonth } from '@/shared/lib/format.functions'
import { dailyDate } from '@/shared/game/puzzleSaves.functions'

export function puzzleTitle({
  puzzleId,
  size,
}: {
  puzzleId: string
  size: number
}) {
  const date = dailyDate(puzzleId)
  return date === null
    ? sizeLabel(size)
    : `Daily · ${formatDayMonth(date)} · ${sizeLabel(size)}`
}

export function sizeLabel(size: number): string {
  return `${size} x ${size}`
}
