import { formatDayMonth } from '@/shared/lib/format.functions'
import { PUZZLE_STATUS } from '@/shared/game/puzzleSaves.constants'
import { dailyDate } from '@/shared/game/puzzleSaves.functions'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import {
  LEVEL_LETTERS,
  LEVELS,
} from '@/games/wordWheel/engine/wordWheel.constants'
import type { Level } from '@/games/wordWheel/engine/wordWheel.types'
import type {
  LevelStats,
  Progress,
} from '@/games/wordWheel/engine/wordWheelSaves.types'

export function decodeProgress(text: string): Progress {
  if (text.length === 0) {
    return { found: [], bonus: [], revealed: [] }
  }
  const [found, bonus, revealed] = text.split(';')
  return {
    found: splitList(found),
    bonus: splitList(bonus),
    revealed: splitList(revealed),
  }
}

export function encodeProgress(progress: Progress): string {
  return [progress.found, progress.bonus, progress.revealed]
    .map((list) => list.join(' '))
    .join(';')
}

export function levelLabel(level: Level): string {
  return `${LEVEL_LETTERS[level]} letters`
}

export function levelOf(game: { size: number }): Level {
  return LEVELS[game.size]
}

export function levelStats(games: SavedPuzzle[]): LevelStats[] {
  return LEVELS.map((level, index) => {
    const finished = games.filter(
      (game) =>
        game.size === index && game.status !== PUZZLE_STATUS.IN_PROGRESS,
    )
    const solved = finished.filter(
      (game) => game.status === PUZZLE_STATUS.SOLVED,
    )
    const times = solved.map((game) => game.elapsedMs)
    return {
      level,
      played: finished.length,
      solved: solved.length,
      bonusWords: finished.reduce(
        (sum, game) => sum + decodeProgress(game.changes).bonus.length,
        0,
      ),
      bestMs: times.length > 0 ? Math.min(...times) : null,
    }
  })
}

export function wordWheelTitle(game: { puzzleId: string; size: number }) {
  const label = levelLabel(levelOf(game))
  const date = dailyDate(game.puzzleId)
  return date === null ? label : `Daily · ${formatDayMonth(date)} · ${label}`
}

function splitList(text: string | undefined): string[] {
  return (text ?? '').split(' ').filter((it) => it.length > 0)
}
