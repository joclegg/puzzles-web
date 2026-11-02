import { dailyIndex, randomIndex } from '@/shared/bank/bank.functions'
import { fetchBankLines } from '@/shared/bank/bank.hooks'
import { FIRST_DAY } from '@/games/kakuro/engine/kakuro.constants'
import { GAMES_KEY } from '@/games/kakuro/engine/kakuroSaves.constants'
import { usePuzzleGames } from '@/shared/game/puzzleGame.hooks'
import { dailyPuzzleId } from '@/shared/game/puzzleSaves.functions'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'

export function useKakuroGames() {
  const saves = usePuzzleGames({ key: GAMES_KEY, route: GAME_ROUTE.KAKURO })

  async function startRandom(size: number) {
    const lines = await fetchBankLines(`kakuro/${size}.txt`)
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
    const lines = await fetchBankLines(`kakuro/${size}.txt`)
    const index = dailyIndex({
      count: lines.length,
      orderSeed: size,
      firstDay: FIRST_DAY,
      date,
    })
    saves.startAndOpen({ id, size, puzzle: lines[index] })
  }

  return { ...saves, startRandom, openDaily }
}
