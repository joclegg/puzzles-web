import drawOneDown from '@data/solitaire/drawOne_down.txt?raw'
import drawOneUp from '@data/solitaire/drawOne_up.txt?raw'
import drawThreeDown from '@data/solitaire/drawThree_down.txt?raw'
import drawThreeUp from '@data/solitaire/drawThree_up.txt?raw'
import { BUILD_ORDER, DRAW_MODE } from '@/common/solitaire/solitaire.constants'
import type { BuildOrder, DrawMode } from '@/common/solitaire/solitaire.types'

export const DAILY_SEED_LINES = 1000

export const WINNABLE_SEEDS_TEXT: Record<
  DrawMode,
  Record<BuildOrder, string>
> = {
  [DRAW_MODE.DRAW_ONE]: {
    [BUILD_ORDER.DOWN]: drawOneDown,
    [BUILD_ORDER.UP]: drawOneUp,
  },
  [DRAW_MODE.DRAW_THREE]: {
    [BUILD_ORDER.DOWN]: drawThreeDown,
    [BUILD_ORDER.UP]: drawThreeUp,
  },
}
