import { epochDay } from '@/common/date.functions'
import { dailyPuzzleId, startPuzzle } from '@/common/puzzleSaves.functions'
import type { PuzzleRef, SavedPuzzle } from '@/common/puzzleSaves.types'
import { newSeed } from '@/common/random.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useStoredState } from '@/common/storage.hooks'
import { DAILY_SEED_SPREAD } from '@/common/twoTone/twoTone.constants'
import {
  encodePuzzle,
  generatePuzzle,
} from '@/common/twoTone/twoToneGenerator.functions'
import { GAMES_KEY } from '@/common/twoTone/twoToneSettings.constants'

export function useTwoToneGames() {
  const [games, setGames] = useStoredState<SavedPuzzle[]>({
    key: GAMES_KEY,
    fallback: [],
  })

  function openGame(game: SavedPuzzle) {
    navigate([GAME_ROUTE.TWO_TONE, SCREEN.GAME, game.id])
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

  function startRandom(size: number) {
    const seed = newSeed()
    startAndOpen({
      id: `random_${seed}`,
      size,
      puzzle: encodePuzzle(generatePuzzle({ size, seed })),
    })
  }

  function openDaily({ date, size }: { date: string; size: number }) {
    const id = dailyPuzzleId({ date, size })
    const existing = games.findLast((game) => game.puzzleId === id)
    if (existing) {
      openGame(existing)
      return
    }
    const seed = BigInt(epochDay(date)) * DAILY_SEED_SPREAD + BigInt(size)
    startAndOpen({
      id,
      size,
      puzzle: encodePuzzle(generatePuzzle({ size, seed })),
    })
  }

  return { games, setGames, openGame, startRandom, openDaily }
}
