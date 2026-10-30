import { fetchBank } from '@/common/bank.hooks'
import {
  bankLines,
  dailyIndex,
  randomIndex,
} from '@/common/kakuro/kakuroBank.functions'
import { GAMES_KEY } from '@/common/kakuro/kakuroSettings.constants'
import {
  dailyPuzzleId,
  revealPuzzle,
  solvePuzzle,
  startPuzzle,
  updatePuzzle,
} from '@/common/puzzleSaves.functions'
import type { PuzzleRef, SavedPuzzle } from '@/common/puzzleSaves.types'
import { newSeed } from '@/common/random.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useStoredState } from '@/common/storage.hooks'

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
    const lines = bankLines(await fetchBank(`kakuro/${size}.txt`))
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
    const lines = bankLines(await fetchBank(`kakuro/${size}.txt`))
    const index = dailyIndex({ count: lines.length, size, date })
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
