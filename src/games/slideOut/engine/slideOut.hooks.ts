import { DAILY_PREFIX } from '@/shared/game/puzzleSaves.constants'
import {
  revealPuzzle,
  solvePuzzle,
  startPuzzle,
  updatePuzzle,
} from '@/shared/game/puzzleSaves.functions'
import type { PuzzleRef, SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { FIRST_DAY, LEVELS } from '@/games/slideOut/engine/slideOut.constants'
import type { Level } from '@/games/slideOut/engine/slideOut.types'
import { dailyIndex, randomIndex } from '@/shared/bank/bank.functions'
import { fetchBankLines } from '@/shared/bank/bank.hooks'
import { GAMES_KEY } from '@/games/slideOut/engine/slideOutSaves.constants'
import { useStoredState } from '@/shared/storage/storage.hooks'

export function useSlideOutGames() {
  const [games, setGames] = useStoredState<SavedPuzzle[]>({
    key: GAMES_KEY,
    fallback: [],
  })

  function openGame(game: SavedPuzzle) {
    navigate([GAME_ROUTE.SLIDE_OUT, SCREEN.GAME, game.id])
  }

  function startAndOpen(ref: PuzzleRef) {
    const created = startPuzzle({
      games,
      id: crypto.randomUUID(),
      ref,
      now: Date.now(),
    })
    setGames(() => created.games)
    openGame(created.game)
  }

  async function startRandom(level: Level) {
    const lines = await fetchBankLines(`slideout/${level}.txt`)
    const index = randomIndex({ count: lines.length, seed: newSeed() })
    startAndOpen({
      id: `bank_${level}_${index}`,
      size: LEVELS.indexOf(level),
      puzzle: lines[index],
    })
  }

  async function openDaily({ date, level }: { date: string; level: Level }) {
    const id = `${DAILY_PREFIX}${date}_${level}`
    const existing = games.findLast((game) => game.puzzleId === id)
    if (existing) {
      openGame(existing)
      return
    }
    const lines = await fetchBankLines(`slideout/${level}.txt`)
    const index = dailyIndex({
      count: lines.length,
      orderSeed: LEVELS.indexOf(level),
      firstDay: FIRST_DAY,
      date,
    })
    startAndOpen({ id, size: LEVELS.indexOf(level), puzzle: lines[index] })
  }

  function saveProgress({
    id,
    patch,
  }: {
    id: string
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
    id: string
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

  function reveal({ id, elapsedMs }: { id: string; elapsedMs: number }) {
    setGames((all) =>
      revealPuzzle({ games: all, id, elapsedMs, now: Date.now() }),
    )
  }

  return {
    games,
    openGame,
    startRandom,
    openDaily,
    saveProgress,
    finish,
    reveal,
  }
}
