import { GAME_ROUTE, LAUNCHER_ROUTE } from '@/shared/lib/route.constants'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import type { MenuAccent } from '@/shared/screens/MenuScreen/MenuScreen.types'

export const SETTINGS_TABS: readonly {
  route:
    | (typeof GAME_ROUTE)[keyof typeof GAME_ROUTE]
    | typeof LAUNCHER_ROUTE.SETTINGS
  label: string
  accent: MenuAccent
}[] = [
  {
    route: LAUNCHER_ROUTE.SETTINGS,
    label: 'General',
    accent: MENU_ACCENT.SUDOKU,
  },
  { route: GAME_ROUTE.SUDOKU, label: 'Sudoku', accent: MENU_ACCENT.SUDOKU },
  {
    route: GAME_ROUTE.SOLITAIRE,
    label: 'Solitaire',
    accent: MENU_ACCENT.SOLITAIRE,
  },
  {
    route: GAME_ROUTE.TWO_TONE,
    label: 'Two Tone',
    accent: MENU_ACCENT.TWO_TONE,
  },
  {
    route: GAME_ROUTE.SIGHTLINES,
    label: 'Sightlines',
    accent: MENU_ACCENT.SIGHTLINES,
  },
  {
    route: GAME_ROUTE.FIVE_LETTERS,
    label: 'Five Letters',
    accent: MENU_ACCENT.FIVE_LETTERS,
  },
  { route: GAME_ROUTE.KAKURO, label: 'Kakuro', accent: MENU_ACCENT.KAKURO },
  {
    route: GAME_ROUTE.SLIDE_OUT,
    label: 'Slide Out',
    accent: MENU_ACCENT.SLIDE_OUT,
  },
  {
    route: GAME_ROUTE.WORD_WHEEL,
    label: 'Word Wheel',
    accent: MENU_ACCENT.WORD_WHEEL,
  },
]
