import { useMemo } from 'react'

import { DAILY_PREFIX } from '@/shared/game/puzzleSaves.constants'
import { usePuzzleGames } from '@/shared/game/puzzleGame.hooks'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  FIRST_DAY,
  LEVELS,
  VALID_WORDS_PATH,
} from '@/games/wordWheel/engine/wordWheel.constants'
import type { Level } from '@/games/wordWheel/engine/wordWheel.types'
import { dailyIndex, randomIndex } from '@/shared/bank/bank.functions'
import { fetchBankLines, useBank } from '@/shared/bank/bank.hooks'
import { validWords } from '@/games/wordWheel/engine/wordWheel.functions'
import { stripFoundWords } from '@/games/wordWheel/engine/wordWheelSaves.functions'
import { GAMES_KEY } from '@/games/wordWheel/engine/wordWheelSaves.constants'

export function useValidWords(): Set<string> | null {
  const text = useBank(VALID_WORDS_PATH)
  return useMemo(() => (text === null ? null : validWords(text)), [text])
}

export function useWordWheelGames() {
  const saves = usePuzzleGames({
    key: GAMES_KEY,
    route: GAME_ROUTE.WORD_WHEEL,
    strip: stripFoundWords,
  })

  async function startRandom(level: Level) {
    const lines = await fetchBankLines(`wordwheel/${level}.txt`)
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
    const lines = await fetchBankLines(`wordwheel/${level}.txt`)
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
