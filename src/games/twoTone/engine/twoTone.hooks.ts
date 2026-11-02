import { epochDay } from '@/shared/lib/date.functions'
import { dailyPuzzleId, startPuzzle } from '@/shared/game/puzzleSaves.functions'
import type { PuzzleRef, SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { DAILY_SEED_SPREAD } from '@/games/twoTone/engine/twoTone.constants'
import {
  encodePuzzle,
  generatePuzzle,
} from '@/games/twoTone/engine/twoToneGenerator.functions'
import { GAMES_KEY } from '@/games/twoTone/engine/twoToneSaves.constants'

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
