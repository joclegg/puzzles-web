import { lazy } from 'react'

import { PUZZLE_SCREENS } from '@/shared/game/game.constants'
import type { GameDefinition } from '@/shared/game/game.types'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export const DEFINITION: GameDefinition = {
  id: GAME_ROUTE.TWO_TONE,
  name: 'Two Tone',
  accent: MENU_ACCENT.TWO_TONE,
  bankPaths: [],
  screens: PUZZLE_SCREENS,
  View: lazy(() =>
    import('@/games/twoTone/ui/TwoToneView/TwoToneView').then((module) => ({
      default: module.TwoToneView,
    })),
  ),
}
