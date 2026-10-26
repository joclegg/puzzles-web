import { formatDayMonth } from '@/common/format.functions'
import { dailyDate } from '@/common/puzzleSaves.functions'

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
