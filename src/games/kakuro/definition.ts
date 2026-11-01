import { lazy } from 'react'

import { PUZZLE_SCREENS } from '@/shared/game/game.constants'
import type { GameDefinition } from '@/shared/game/game.types'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export const DEFINITION: GameDefinition = {
  id: GAME_ROUTE.KAKURO,
  name: 'Kakuro',
  accent: MENU_ACCENT.KAKURO,
  bankPaths: ['kakuro/'],
  screens: PUZZLE_SCREENS,
  View: lazy(() =>
    import('@/games/kakuro/ui/KakuroView/KakuroView').then((module) => ({
      default: module.KakuroView,
    })),
  ),
}
