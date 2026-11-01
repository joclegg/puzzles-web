import { lazy } from 'react'

import { PUZZLE_SCREENS } from '@/shared/game/game.constants'
import type { GameDefinition } from '@/shared/game/game.types'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export const DEFINITION: GameDefinition = {
  id: GAME_ROUTE.SOLITAIRE,
  name: 'Solitaire',
  accent: MENU_ACCENT.SOLITAIRE,
  bankPaths: ['solitaire/'],
  screens: PUZZLE_SCREENS,
  View: lazy(() =>
    import('@/games/solitaire/ui/SolitaireView/SolitaireView').then(
      (module) => ({
        default: module.SolitaireView,
      }),
    ),
  ),
}
