import { lazy } from 'react'

import { PUZZLE_SCREENS } from '@/shared/game/game.constants'
import type { GameDefinition } from '@/shared/game/game.types'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export const DEFINITION: GameDefinition = {
  id: GAME_ROUTE.SLIDE_OUT,
  name: 'Slide Out',
  accent: MENU_ACCENT.SLIDE_OUT,
  bankPaths: ['slideout/'],
  screens: PUZZLE_SCREENS,
  View: lazy(() =>
    import('@/games/slideOut/ui/SlideOutView/SlideOutView').then((module) => ({
      default: module.SlideOutView,
    })),
  ),
}
