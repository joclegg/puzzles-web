import type { DailyResult } from '@/common/dailyMedal.types'
import { formatDayMonth } from '@/common/format.functions'
import {
  DIFFICULTY_LABEL,
  GAME_MODES,
  GAME_MODE_LABEL,
  LEVELS,
} from '@/common/sudoku/sudoku.constants'
import type { GameMode, MistakeCheck } from '@/common/sudoku/sudoku.types'
import { parseDailyId } from '@/common/sudoku/sudokuBank.functions'
import { decodePuzzle } from '@/common/sudoku/sudokuPuzzle.functions'
import { SUDOKU_STATUS } from '@/common/sudoku/sudokuSaves.constants'
import type {
  PastBest,
  BestTime,
  SavedSudoku,
  SudokuRef,
  SudokuStatus,
} from '@/common/sudoku/sudokuSaves.types'

export function bestTimes({
  games,
  pastBests,
}: {
  games: SavedSudoku[]
  pastBests: PastBest[]
}): BestTime[] {
  return GAME_MODES.flatMap((mode) =>
    LEVELS[mode].map((difficulty) => {
      const times = games
        .filter(
          (game) =>
            !game.custom &&
            game.mode === mode &&
            game.difficulty === difficulty &&
            game.status === SUDOKU_STATUS.COMPLETED,
        )
        .map((game) => game.elapsedMs)
      const bests = [
        ...times,
        ...pastBests
          .filter((it) => it.mode === mode && it.difficulty === difficulty)
          .map((it) => it.bestMs),
      ]
      return {
        mode,
        difficulty,
        bestMs: bests.length > 0 ? Math.min(...bests) : null,
        averageMs:
          times.length > 0
            ? Math.floor(times.reduce((sum, ms) => sum + ms, 0) / times.length)
            : null,
        completed: times.length,
      }
    }),
  )
}

export function dailyResults(games: SavedSudoku[]): DailyResult[] {
  return games.flatMap((game) => {
    const daily = parseDailyId(game.puzzleId)
    return game.status === SUDOKU_STATUS.COMPLETED && daily !== null
      ? [{ date: daily.date, id: game.puzzleId, finishedAt: game.finishedAt }]
      : []
  })
}

export function finishSudoku({
  games,
  id,
  status,
  patch,
  now,
}: {
  games: SavedSudoku[]
  id: string
  status: SudokuStatus
  patch: Partial<SavedSudoku>
  now: number
}): { games: SavedSudoku[]; newBest: boolean } {
  const updated = games.map((game) =>
    game.id === id ? { ...game, ...patch, status, finishedAt: now } : game,
  )
  const finished = updated.find((game) => game.id === id)
  if (
    finished === undefined ||
    status !== SUDOKU_STATUS.COMPLETED ||
    finished.custom ||
    finished.difficulty === null
  ) {
    return { games: updated, newBest: false }
  }
  const previous = updated
    .filter(
      (game) =>
        game.id !== id &&
        !game.custom &&
        game.mode === finished.mode &&
        game.difficulty === finished.difficulty &&
        game.status === SUDOKU_STATUS.COMPLETED,
    )
    .map((game) => game.elapsedMs)
  return {
    games: updated,
    newBest:
      previous.length === 0 || finished.elapsedMs < Math.min(...previous),
  }
}

export function playedIds({
  games,
  mode,
}: {
  games: SavedSudoku[]
  mode: GameMode
}) {
  return new Set(
    games.filter((game) => game.mode === mode).map((game) => game.puzzleId),
  )
}

export function startSudoku({
  games,
  id,
  ref,
  mistakeCheck,
  now,
}: {
  games: SavedSudoku[]
  id: string
  ref: SudokuRef
  mistakeCheck: MistakeCheck
  now: number
}): { games: SavedSudoku[]; game: SavedSudoku } {
  const slot = slotOf(ref)
  const kept = games.map((game) =>
    game.status === SUDOKU_STATUS.IN_PROGRESS && slotOf(game) === slot
      ? { ...game, status: SUDOKU_STATUS.ABANDONED }
      : game,
  )
  const givens = decodePuzzle(ref.puzzle).givens
  const game: SavedSudoku = {
    ...ref,
    id,
    values: givens.join(''),
    notes: givens.map(() => 0),
    moves: '',
    elapsedMs: 0,
    mistakes: 0,
    mistakeCheck,
    status: SUDOKU_STATUS.IN_PROGRESS,
    startedAt: now,
    finishedAt: null,
  }
  return { games: [...kept, game], game }
}

export function sudokuTitle(
  game: Pick<SavedSudoku, 'puzzleId' | 'mode' | 'difficulty' | 'custom'>,
) {
  const mode = GAME_MODE_LABEL[game.mode]
  if (game.custom) {
    return `${mode} · Custom`
  }
  const daily = parseDailyId(game.puzzleId)
  const level =
    game.difficulty === null ? '' : ` · ${DIFFICULTY_LABEL[game.difficulty]}`
  return daily === null
    ? `${mode}${level}`
    : `Daily ${mode.toLowerCase()} · ${formatDayMonth(daily.date)}${level}`
}

function slotOf(
  ref: Pick<SudokuRef, 'puzzleId' | 'mode' | 'difficulty' | 'custom'>,
) {
  if (ref.custom) {
    return 'custom'
  }
  return parseDailyId(ref.puzzleId) !== null
    ? ref.puzzleId
    : `${ref.mode}_${ref.difficulty}`
}
