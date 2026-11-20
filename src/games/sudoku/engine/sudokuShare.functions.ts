import { dailyDays } from '@/shared/game/dailyMedal.functions'
import {
  dailiesShareText,
  dailyLine,
  dailyStreaks,
  recordsShareText,
  streakSummary,
} from '@/shared/game/share.functions'
import { formatDuration } from '@/shared/lib/format.functions'
import {
  DIFFICULTY_LABEL,
  GAME_MODE_LABEL,
} from '@/games/sudoku/engine/sudoku.constants'
import { dailySudokuId } from '@/games/sudoku/engine/sudokuBank.functions'
import { SUDOKU_STATUS } from '@/games/sudoku/engine/sudokuSaves.constants'
import {
  bestTimes,
  dailyResults,
} from '@/games/sudoku/engine/sudokuSaves.functions'
import type {
  PastBest,
  SavedSudoku,
} from '@/games/sudoku/engine/sudokuSaves.types'

export function sudokuDailiesShare({
  name,
  games,
  pastBests,
  date,
  dayOf,
}: {
  name: string
  games: SavedSudoku[]
  pastBests: PastBest[]
  date: string
  dayOf: (ms: number) => string
}): string {
  const times = bestTimes({ games, pastBests })
  const body = times
    .map(({ mode, difficulty, bestMs }) => {
      const id = dailySudokuId({ mode, difficulty, date })
      const daily = games.find(
        (game) =>
          game.puzzleId === id && game.status === SUDOKU_STATUS.COMPLETED,
      )
      return dailyLine({
        label: `${GAME_MODE_LABEL[mode]} ${DIFFICULTY_LABEL[difficulty]}`,
        ms: daily?.elapsedMs ?? null,
        best: daily !== undefined && daily.elapsedMs <= (bestMs ?? Infinity),
      })
    })
    .join('\n')
  return dailiesShareText({
    name,
    date,
    body,
    days: dailyDays({
      results: dailyResults(games),
      total: times.length,
      dayOf,
    }),
  })
}

export function sudokuRecordsShare({
  name,
  games,
  pastBests,
  today,
}: {
  name: string
  games: SavedSudoku[]
  pastBests: PastBest[]
  today: string
}): string {
  const times = bestTimes({ games, pastBests })
  const { current, longest } = dailyStreaks({
    results: dailyResults(games),
    today,
  })
  const solved = times.reduce((sum, row) => sum + row.completed, 0)
  return recordsShareText({
    name,
    lines: times.flatMap(({ mode, difficulty, bestMs }) =>
      bestMs === null
        ? []
        : [
            `${GAME_MODE_LABEL[mode]} ${DIFFICULTY_LABEL[difficulty]} ${formatDuration(bestMs)}`,
          ],
    ),
    summary: streakSummary({ lead: `${solved} solved`, current, longest }),
  })
}
