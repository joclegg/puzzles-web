import { formatDayMonth } from '@/shared/lib/format.functions'
import { PUZZLE_STATUS } from '@/shared/game/puzzleSaves.constants'
import { dailyDate } from '@/shared/game/puzzleSaves.functions'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { LEVEL_LABEL, LEVELS } from '@/games/slideOut/engine/slideOut.constants'
import type { Level } from '@/games/slideOut/engine/slideOut.types'
import {
  decodeMoves,
  decodePuzzle,
} from '@/games/slideOut/engine/slideOutBoard.functions'
import type { LevelStats } from '@/games/slideOut/engine/slideOutSaves.types'

export function levelOf(game: { size: number }): Level {
  return LEVELS[Math.min(game.size, LEVELS.length - 1)]
}

export function levelStats(games: SavedPuzzle[]): LevelStats[] {
  return LEVELS.map((level) => {
    const finished = games.filter(
      (game) =>
        levelOf(game) === level && game.status !== PUZZLE_STATUS.IN_PROGRESS,
    )
    const solved = finished.filter(
      (game) => game.status === PUZZLE_STATUS.SOLVED,
    )
    const times = solved.map((game) => game.elapsedMs)
    return {
      level,
      played: finished.length,
      solved: solved.length,
      atPar: solved.filter(
        (game) =>
          decodeMoves(game.changes).length <= decodePuzzle(game.puzzle).par,
      ).length,
      bestMs: times.length > 0 ? Math.min(...times) : null,
    }
  })
}

export function slideOutTitle(game: { puzzleId: string; size: number }) {
  const label = LEVEL_LABEL[levelOf(game)]
  const date = dailyDate(game.puzzleId)
  return date === null ? label : `Daily · ${formatDayMonth(date)} · ${label}`
}
