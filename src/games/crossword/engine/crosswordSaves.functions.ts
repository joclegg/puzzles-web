import { SIZE_NAME } from '@/games/crossword/engine/crossword.constants'
import { dailyDate } from '@/shared/game/puzzleSaves.functions'
import { formatDayMonth } from '@/shared/lib/format.functions'

export function crosswordSizeLabel(size: number): string {
  return SIZE_NAME[size] ?? `${size} x ${size}`
}

export function crosswordTitle({
  puzzleId,
  size,
}: {
  puzzleId: string
  size: number
}): string {
  const date = dailyDate(puzzleId)
  return date === null
    ? crosswordSizeLabel(size)
    : `Daily · ${formatDayMonth(date)} · ${crosswordSizeLabel(size)}`
}
