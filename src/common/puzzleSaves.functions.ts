import { DAILY_PREFIX, PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import type {
  PuzzleRef,
  SavedPuzzle,
  SizeStats,
} from '@/common/puzzleSaves.types'

export function dailyDate(puzzleId: string): string | null {
  return isDailyPuzzle(puzzleId)
    ? puzzleId.slice(DAILY_PREFIX.length).split('_')[0]
    : null
}

export function dailyPuzzleId({ date, size }: { date: string; size: number }) {
  return `${DAILY_PREFIX}${date}_${size}`
}

export function inProgressPuzzles(games: SavedPuzzle[]): SavedPuzzle[] {
  return games
    .filter((game) => game.status === PUZZLE_STATUS.IN_PROGRESS)
    .sort((a, b) => b.startedAt - a.startedAt)
}

export function isDailyPuzzle(puzzleId: string): boolean {
  return puzzleId.startsWith(DAILY_PREFIX)
}

export function puzzleSlot({
  puzzleId,
  size,
}: {
  puzzleId: string
  size: number
}) {
  return isDailyPuzzle(puzzleId) ? puzzleId : `size_${size}`
}

export function sizeStats({
  games,
  sizes,
}: {
  games: SavedPuzzle[]
  sizes: readonly number[]
}): SizeStats[] {
  return sizes.map((size) => {
    const finished = games.filter(
      (game) => game.size === size && game.status !== PUZZLE_STATUS.IN_PROGRESS,
    )
    const times = finished
      .filter((game) => game.status === PUZZLE_STATUS.SOLVED)
      .map((game) => game.elapsedMs)
    return {
      size,
      played: finished.length,
      solved: times.length,
      bestMs: times.length > 0 ? Math.min(...times) : null,
      averageMs:
        times.length > 0
          ? Math.floor(times.reduce((sum, ms) => sum + ms, 0) / times.length)
          : null,
    }
  })
}

export function solvePuzzle({
  games,
  id,
  elapsedMs,
  changes,
  hints,
  now,
}: {
  games: SavedPuzzle[]
  id: number
  elapsedMs: number
  changes: string
  hints: number
  now: number
}): { games: SavedPuzzle[]; newBest: boolean } {
  const solved = games.find((game) => game.id === id)
  const previous = games
    .filter(
      (game) =>
        game.id !== id &&
        game.size === solved?.size &&
        game.status === PUZZLE_STATUS.SOLVED,
    )
    .map((game) => game.elapsedMs)
  return {
    games: updatePuzzle({
      games,
      id,
      patch: {
        elapsedMs,
        changes,
        hints,
        status: PUZZLE_STATUS.SOLVED,
        finishedAt: now,
      },
    }),
    newBest: previous.length === 0 || elapsedMs < Math.min(...previous),
  }
}

export function startPuzzle({
  games,
  ref,
  now,
}: {
  games: SavedPuzzle[]
  ref: PuzzleRef
  now: number
}): { games: SavedPuzzle[]; game: SavedPuzzle } {
  const slot = puzzleSlot({ puzzleId: ref.id, size: ref.size })
  const kept = games.map((game) =>
    game.status === PUZZLE_STATUS.IN_PROGRESS &&
    puzzleSlot({ puzzleId: game.puzzleId, size: game.size }) === slot
      ? { ...game, status: PUZZLE_STATUS.ABANDONED }
      : game,
  )
  const game: SavedPuzzle = {
    id: games.reduce((highest, it) => Math.max(highest, it.id), 0) + 1,
    puzzleId: ref.id,
    size: ref.size,
    puzzle: ref.puzzle,
    changes: '',
    elapsedMs: 0,
    hints: 0,
    status: PUZZLE_STATUS.IN_PROGRESS,
    startedAt: now,
    finishedAt: null,
  }
  return { games: [...kept, game], game }
}

export function updatePuzzle({
  games,
  id,
  patch,
}: {
  games: SavedPuzzle[]
  id: number
  patch: Partial<SavedPuzzle>
}): SavedPuzzle[] {
  return games.map((game) => (game.id === id ? { ...game, ...patch } : game))
}
