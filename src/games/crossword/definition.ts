import { lazy } from 'react'

import { PUZZLE_SCREENS } from '@/shared/game/game.constants'
import type { GameDefinition } from '@/shared/game/game.types'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export const DEFINITION: GameDefinition = {
  id: GAME_ROUTE.CROSSWORD,
  name: 'Crossword',
  accent: MENU_ACCENT.CROSSWORD,
  bankPaths: ['crossword/'],
  screens: PUZZLE_SCREENS,
  View: lazy(() =>
    import('@/games/crossword/ui/CrosswordView/CrosswordView').then(
      (module) => ({
        default: module.CrosswordView,
      }),
    ),
  ),
}
