import { lazy } from 'react'

import type { GameDefinition } from '@/common/game.types'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

const PUZZLE_SCREENS = [
  SCREEN.HOME,
  SCREEN.PLAY,
  SCREEN.GAME,
  SCREEN.STATS,
  SCREEN.HISTORY,
  SCREEN.DAILY,
  SCREEN.SETTINGS,
] as const

export const GAMES: readonly GameDefinition[] = [
  {
    id: GAME_ROUTE.SUDOKU,
    name: 'Sudoku',
    accent: MENU_ACCENT.SUDOKU,
    bankPaths: ['sudoku/'],
    screens: [...PUZZLE_SCREENS, SCREEN.ENTRY],
    View: lazy(() =>
      import('@/views/SudokuView/SudokuView').then((module) => ({
        default: module.SudokuView,
      })),
    ),
  },
  {
    id: GAME_ROUTE.SOLITAIRE,
    name: 'Solitaire',
    accent: MENU_ACCENT.SOLITAIRE,
    bankPaths: ['solitaire/'],
    screens: PUZZLE_SCREENS,
    View: lazy(() =>
      import('@/views/SolitaireView/SolitaireView').then((module) => ({
        default: module.SolitaireView,
      })),
    ),
  },
  {
    id: GAME_ROUTE.TWO_TONE,
    name: 'Two Tone',
    accent: MENU_ACCENT.TWO_TONE,
    bankPaths: [],
    screens: PUZZLE_SCREENS,
    View: lazy(() =>
      import('@/views/TwoToneView/TwoToneView').then((module) => ({
        default: module.TwoToneView,
      })),
    ),
  },
  {
    id: GAME_ROUTE.SIGHTLINES,
    name: 'Sightlines',
    accent: MENU_ACCENT.SIGHTLINES,
    bankPaths: [],
    screens: PUZZLE_SCREENS,
    View: lazy(() =>
      import('@/views/SightlinesView/SightlinesView').then((module) => ({
        default: module.SightlinesView,
      })),
    ),
  },
  {
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
      import('@/views/FiveLettersView/FiveLettersView').then((module) => ({
        default: module.FiveLettersView,
      })),
    ),
  },
  {
    id: GAME_ROUTE.KAKURO,
    name: 'Kakuro',
    accent: MENU_ACCENT.KAKURO,
    bankPaths: ['kakuro/'],
    screens: PUZZLE_SCREENS,
    View: lazy(() =>
      import('@/views/KakuroView/KakuroView').then((module) => ({
        default: module.KakuroView,
      })),
    ),
  },
  {
    id: GAME_ROUTE.SLIDE_OUT,
    name: 'Slide Out',
    accent: MENU_ACCENT.SLIDE_OUT,
    bankPaths: ['slideout/'],
    screens: PUZZLE_SCREENS,
    View: lazy(() =>
      import('@/views/SlideOutView/SlideOutView').then((module) => ({
        default: module.SlideOutView,
      })),
    ),
  },
  {
    id: GAME_ROUTE.WORD_WHEEL,
    name: 'Word Wheel',
    accent: MENU_ACCENT.WORD_WHEEL,
    bankPaths: ['wordwheel/'],
    screens: PUZZLE_SCREENS,
    View: lazy(() =>
      import('@/views/WordWheelView/WordWheelView').then((module) => ({
        default: module.WordWheelView,
      })),
    ),
  },
]
