import type { PuzzleOptions } from '@/shared/game/game.types'
import { DAILY_PREFIX } from '@/shared/game/puzzleSaves.constants'
import {
  LEVEL_LETTERS,
  LEVELS,
} from '@/games/wordWheel/engine/wordWheel.constants'
import {
  levelLabel,
  levelOf,
  wordWheelTitle,
} from '@/games/wordWheel/engine/wordWheelSaves.functions'
import type { Level } from '@/games/wordWheel/engine/wordWheel.types'

export const OPTIONS: PuzzleOptions<Level> = {
  filterName: 'Level',
  values: LEVELS,
  label: (value) => levelLabel(value),
  filterLabel: (value) => String(LEVEL_LETTERS[value]),
  of: levelOf,
  dailyId: ({ date, value }) => `${DAILY_PREFIX}${date}_${value}`,
  title: wordWheelTitle,
}
