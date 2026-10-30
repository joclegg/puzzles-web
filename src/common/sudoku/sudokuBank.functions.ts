import { epochDay } from '@/common/date.functions'
import { createRandom, newSeed } from '@/common/random.functions'
import {
  BANK_SIZE,
  DAILY_SEED_STRIDE,
  GAME_MODES,
  LEVELS,
} from '@/common/sudoku/sudoku.constants'
import type { Difficulty, GameMode } from '@/common/sudoku/sudoku.types'

export function bankFile({
  mode,
  difficulty,
}: {
  mode: GameMode
  difficulty: Difficulty
}) {
  return `${mode}_${difficulty}`
}

export function dailyPick({ mode, date }: { mode: GameMode; date: string }) {
  const random = createRandom(
    BigInt(epochDay(date)) * DAILY_SEED_STRIDE +
      BigInt(GAME_MODES.indexOf(mode)),
  )
  const levels = LEVELS[mode]
  const difficulty = levels[random.nextIntBelow(levels.length)]
  return { difficulty, index: random.nextIntBelow(BANK_SIZE) }
}

export function dailySudokuId({
  mode,
  date,
}: {
  mode: GameMode
  date: string
}) {
  return `daily_${mode}:${date}`
}

export function nextUnplayedIndex({
  mode,
  difficulty,
  played,
  seed = newSeed(),
}: {
  mode: GameMode
  difficulty: Difficulty
  played: Set<string>
  seed?: bigint
}): number {
  const file = bankFile({ mode, difficulty })
  const unplayed = Array.from({ length: BANK_SIZE }, (_, i) => i).filter(
    (i) => !played.has(`${file}:${i}`),
  )
  const random = createRandom(seed)
  return unplayed.length > 0
    ? unplayed[random.nextIntBelow(unplayed.length)]
    : random.nextIntBelow(BANK_SIZE)
}

export function parseDailyId(
  id: string,
): { mode: GameMode; date: string } | null {
  const match = /^daily_(classic|killer):(\d{4}-\d{2}-\d{2})$/.exec(id)
  return match === null ? null : { mode: match[1] as GameMode, date: match[2] }
}
