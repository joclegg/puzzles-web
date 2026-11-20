import type { PuzzleOptions } from '@/shared/game/game.types'
import { DAILY_PREFIX } from '@/shared/game/puzzleSaves.constants'
import { LEVEL_LABEL, LEVELS } from '@/games/slideOut/engine/slideOut.constants'
import {
  levelOf,
  slideOutTitle,
} from '@/games/slideOut/engine/slideOutSaves.functions'
import type { Level } from '@/games/slideOut/engine/slideOut.types'

export const OPTIONS: PuzzleOptions<Level> = {
  filterName: 'Level',
  values: LEVELS,
  label: (value) => LEVEL_LABEL[value],
  filterLabel: (value) => LEVEL_LABEL[value],
  of: levelOf,
  dailyId: ({ date, value }) => `${DAILY_PREFIX}${date}_${value}`,
  title: slideOutTitle,
}
