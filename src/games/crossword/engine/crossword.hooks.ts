import { dailyIndex, randomIndex } from '@/shared/bank/bank.functions'
import { fetchBankLines } from '@/shared/bank/bank.hooks'
import {
  CLUES_PATH,
  DAILY_POOL,
  FIRST_DAY,
  SIZE_PATH,
} from '@/games/crossword/engine/crossword.constants'
import { GAMES_KEY } from '@/games/crossword/engine/crosswordSaves.constants'
import { usePuzzleGames } from '@/shared/game/puzzleGame.hooks'
import { dailyPuzzleId } from '@/shared/game/puzzleSaves.functions'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'

export function useCrosswordGames() {
  const saves = usePuzzleGames({ key: GAMES_KEY, route: GAME_ROUTE.CROSSWORD })

  async function startRandom(size: number) {
    const [lines] = await Promise.all([
      fetchBankLines(SIZE_PATH[size]),
      fetchBankLines(CLUES_PATH),
    ])
    const index = randomIndex({ count: lines.length, seed: newSeed() })
    saves.startAndOpen({
      id: `bank_${size}_${index}`,
      size,
      puzzle: lines[index],
    })
  }

  async function openDaily({ date, size }: { date: string; size: number }) {
    const id = dailyPuzzleId({ date, size })
    if (saves.openExisting(id)) {
      return
    }
    const [lines] = await Promise.all([
      fetchBankLines(SIZE_PATH[size]),
      fetchBankLines(CLUES_PATH),
    ])
    const index = dailyIndex({
      count: Math.min(lines.length, DAILY_POOL),
      orderSeed: size,
      firstDay: FIRST_DAY,
      date,
    })
    saves.startAndOpen({ id, size, puzzle: lines[index] })
  }

  return { ...saves, startRandom, openDaily }
}
