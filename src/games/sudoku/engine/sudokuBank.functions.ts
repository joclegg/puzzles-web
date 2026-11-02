import { epochDay } from '@/shared/lib/date.functions'
import { createRandom, newSeed } from '@/shared/lib/random.functions'
import {
  BANK_SIZE,
  DAILY_MODE_STRIDE,
  DAILY_SEED_STRIDE,
  GAME_MODES,
  LEVELS,
} from '@/games/sudoku/engine/sudoku.constants'
import type { Difficulty, GameMode } from '@/games/sudoku/engine/sudoku.types'

export function bankFile({
  mode,
  difficulty,
}: {
  mode: GameMode
  difficulty: Difficulty
}) {
  return `${mode}_${difficulty}`
}

export function dailyIndex({
  mode,
  difficulty,
  date,
}: {
  mode: GameMode
  difficulty: Difficulty
  date: string
}) {
  const random = createRandom(
    BigInt(epochDay(date)) * DAILY_SEED_STRIDE +
      BigInt(GAME_MODES.indexOf(mode)) * DAILY_MODE_STRIDE +
      BigInt(LEVELS[mode].indexOf(difficulty)),
  )
  return random.nextIntBelow(BANK_SIZE)
}

export function dailySudokuId({
  mode,
  difficulty,
  date,
}: {
  mode: GameMode
  difficulty: Difficulty
  date: string
}) {
  return `daily_${mode}_${difficulty}:${date}`
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
  const match = /^daily_(classic|killer)(?:_[a-z]+)?:(\d{4}-\d{2}-\d{2})$/.exec(
    id,
  )
  return match === null ? null : { mode: match[1] as GameMode, date: match[2] }
}
