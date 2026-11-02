import { lazy } from 'react'

import { PUZZLE_SCREENS } from '@/shared/game/game.constants'
import type { GameDefinition } from '@/shared/game/game.types'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export const DEFINITION: GameDefinition = {
  id: GAME_ROUTE.WORD_WHEEL,
  name: 'Word Wheel',
  accent: MENU_ACCENT.WORD_WHEEL,
  bankPaths: ['wordwheel/'],
  screens: PUZZLE_SCREENS,
  View: lazy(() =>
    import('@/games/wordWheel/ui/WordWheelView/WordWheelView').then(
      (module) => ({
        default: module.WordWheelView,
      }),
    ),
  ),
}
