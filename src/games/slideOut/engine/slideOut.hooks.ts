import { DAILY_PREFIX } from '@/shared/game/puzzleSaves.constants'
import { usePuzzleGames } from '@/shared/game/puzzleGame.hooks'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { FIRST_DAY, LEVELS } from '@/games/slideOut/engine/slideOut.constants'
import type { Level } from '@/games/slideOut/engine/slideOut.types'
import { dailyIndex, randomIndex } from '@/shared/bank/bank.functions'
import { fetchBankLines } from '@/shared/bank/bank.hooks'
import { GAMES_KEY } from '@/games/slideOut/engine/slideOutSaves.constants'

export function useSlideOutGames() {
  const saves = usePuzzleGames({ key: GAMES_KEY, route: GAME_ROUTE.SLIDE_OUT })

  async function startRandom(level: Level) {
    const lines = await fetchBankLines(`slideout/${level}.txt`)
    const index = randomIndex({ count: lines.length, seed: newSeed() })
    saves.startAndOpen({
      id: `bank_${level}_${index}`,
      size: LEVELS.indexOf(level),
      puzzle: lines[index],
    })
  }

  async function openDaily({ date, level }: { date: string; level: Level }) {
    const id = `${DAILY_PREFIX}${date}_${level}`
    if (saves.openExisting(id)) {
      return
    }
    const lines = await fetchBankLines(`slideout/${level}.txt`)
    const index = dailyIndex({
      count: lines.length,
      orderSeed: LEVELS.indexOf(level),
      firstDay: FIRST_DAY,
      date,
    })
    saves.startAndOpen({
      id,
      size: LEVELS.indexOf(level),
      puzzle: lines[index],
    })
  }

  return { ...saves, startRandom, openDaily }
}
