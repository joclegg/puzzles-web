import { lazy } from 'react'

import type { GameDefinition } from '@/shared/game/game.types'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export const DEFINITION: GameDefinition = {
  id: GAME_ROUTE.FIVE_LETTERS,
  name: 'Five Letters',
  accent: MENU_ACCENT.FIVE_LETTERS,
  bankPaths: ['words/answers.txt', 'words/guesses.txt'],
  screens: [
    SCREEN.HOME,
    SCREEN.PLAY,
    SCREEN.GAME,
    SCREEN.STATS,
    SCREEN.DAILY,
    SCREEN.SETTINGS,
  ],
  View: lazy(() =>
    import('@/games/fiveLetters/ui/FiveLettersView/FiveLettersView').then(
      (module) => ({
        default: module.FiveLettersView,
      }),
    ),
  ),
}
