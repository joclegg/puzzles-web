import { DAILY_PREFIX } from '@/common/puzzleSaves.constants'
import {
  solvePuzzle,
  startPuzzle,
  updatePuzzle,
} from '@/common/puzzleSaves.functions'
import type { PuzzleRef, SavedPuzzle } from '@/common/puzzleSaves.types'
import { newSeed } from '@/common/random.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { LEVELS } from '@/common/slideOut/slideOut.constants'
import type { Level } from '@/common/slideOut/slideOut.types'
import { BANK_TEXT } from '@/common/slideOut/slideOutBank.constants'
import {
  bankLines,
  dailyIndex,
  randomIndex,
} from '@/common/slideOut/slideOutBank.functions'
import { GAMES_KEY } from '@/common/slideOut/slideOutSaves.constants'
import { useStoredState } from '@/common/storage.hooks'

export function useSlideOutGames() {
  const [games, setGames] = useStoredState<SavedPuzzle[]>({
    key: GAMES_KEY,
    fallback: [],
  })

  function openGame(game: SavedPuzzle) {
    navigate([GAME_ROUTE.SLIDE_OUT, SCREEN.GAME, game.id])
  }

  function startAndOpen(ref: PuzzleRef) {
    const created = startPuzzle({ games, ref, now: Date.now() })
    setGames(() => created.games)
    openGame(created.game)
  }

  function startRandom(level: Level) {
    const lines = bankLines(BANK_TEXT[level])
    const index = randomIndex({ count: lines.length, seed: newSeed() })
    startAndOpen({
      id: `bank_${level}_${index}`,
      size: LEVELS.indexOf(level),
      puzzle: lines[index],
    })
  }

  function openDaily({ date, level }: { date: string; level: Level }) {
    const id = `${DAILY_PREFIX}${date}_${level}`
    const existing = games.findLast((game) => game.puzzleId === id)
    if (existing) {
      openGame(existing)
      return
    }
    const lines = bankLines(BANK_TEXT[level])
    const index = dailyIndex({ count: lines.length, level, date })
    startAndOpen({ id, size: LEVELS.indexOf(level), puzzle: lines[index] })
  }

  function saveProgress({
    id,
    patch,
  }: {
    id: number
    patch: Partial<SavedPuzzle>
  }) {
    setGames((all) => updatePuzzle({ games: all, id, patch }))
  }

  function finish({
    id,
    elapsedMs,
    changes,
    hints,
  }: {
    id: number
    elapsedMs: number
    changes: string
    hints: number
  }): boolean {
    const finished = solvePuzzle({
      games,
      id,
      elapsedMs,
      changes,
      hints,
      now: Date.now(),
    })
    setGames(() => finished.games)
    return finished.newBest
  }

  return { games, openGame, startRandom, openDaily, saveProgress, finish }
}
