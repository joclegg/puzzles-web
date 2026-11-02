import { dailyIndex, randomIndex } from '@/shared/bank/bank.functions'
import { fetchBankLines } from '@/shared/bank/bank.hooks'
import { FIRST_DAY } from '@/games/kakuro/engine/kakuro.constants'
import { GAMES_KEY } from '@/games/kakuro/engine/kakuroSaves.constants'
import {
  dailyPuzzleId,
  revealPuzzle,
  solvePuzzle,
  startPuzzle,
  updatePuzzle,
} from '@/shared/game/puzzleSaves.functions'
import type { PuzzleRef, SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { useStoredState } from '@/shared/storage/storage.hooks'

export function useKakuroGames() {
  const [games, setGames] = useStoredState<SavedPuzzle[]>({
    key: GAMES_KEY,
    fallback: [],
  })

  function openGame(game: SavedPuzzle) {
    navigate([GAME_ROUTE.KAKURO, SCREEN.GAME, game.id])
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

  async function startRandom(size: number) {
    const lines = await fetchBankLines(`kakuro/${size}.txt`)
    const index = randomIndex({ count: lines.length, seed: newSeed() })
    startAndOpen({ id: `bank_${size}_${index}`, size, puzzle: lines[index] })
  }

  async function openDaily({ date, size }: { date: string; size: number }) {
    const id = dailyPuzzleId({ date, size })
    const existing = games.findLast((game) => game.puzzleId === id)
    if (existing) {
      openGame(existing)
      return
    }
    const lines = await fetchBankLines(`kakuro/${size}.txt`)
    const index = dailyIndex({
      count: lines.length,
      orderSeed: size,
      firstDay: FIRST_DAY,
      date,
    })
    startAndOpen({ id, size, puzzle: lines[index] })
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
    mistakes,
  }: {
    id: string
    elapsedMs: number
    changes: string
    mistakes: number
  }): boolean {
    const finished = solvePuzzle({
      games,
      id,
      elapsedMs,
      changes,
      hints: 0,
      mistakes,
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
