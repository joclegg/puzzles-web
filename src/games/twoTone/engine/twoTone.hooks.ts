import { epochDay } from '@/shared/lib/date.functions'
import { usePuzzleGames } from '@/shared/game/puzzleGame.hooks'
import { dailyPuzzleId } from '@/shared/game/puzzleSaves.functions'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { DAILY_SEED_SPREAD } from '@/games/twoTone/engine/twoTone.constants'
import {
  encodePuzzle,
  generatePuzzle,
} from '@/games/twoTone/engine/twoToneGenerator.functions'
import { GAMES_KEY } from '@/games/twoTone/engine/twoToneSaves.constants'

export function useTwoToneGames() {
  const saves = usePuzzleGames({ key: GAMES_KEY, route: GAME_ROUTE.TWO_TONE })

  function startRandom(size: number) {
    const seed = newSeed()
    saves.startAndOpen({
      id: `random_${seed}`,
      size,
      puzzle: encodePuzzle(generatePuzzle({ size, seed })),
    })
  }

  function openDaily({ date, size }: { date: string; size: number }) {
    const id = dailyPuzzleId({ date, size })
    if (saves.openExisting(id)) {
      return
    }
    const seed = BigInt(epochDay(date)) * DAILY_SEED_SPREAD + BigInt(size)
    saves.startAndOpen({
      id,
      size,
      puzzle: encodePuzzle(generatePuzzle({ size, seed })),
    })
  }

  return { ...saves, startRandom, openDaily }
}
