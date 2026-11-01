import { lazy } from 'react'

import { PUZZLE_SCREENS } from '@/shared/game/game.constants'
import type { GameDefinition } from '@/shared/game/game.types'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export const DEFINITION: GameDefinition = {
  id: GAME_ROUTE.SUDOKU,
  name: 'Sudoku',
  accent: MENU_ACCENT.SUDOKU,
  bankPaths: ['sudoku/'],
  screens: [...PUZZLE_SCREENS, SCREEN.ENTRY],
  View: lazy(() =>
    import('@/games/sudoku/ui/SudokuView/SudokuView').then((module) => ({
      default: module.SudokuView,
    })),
  ),
}
