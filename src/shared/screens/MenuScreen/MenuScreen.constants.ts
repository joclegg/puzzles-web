import type { MenuAccent } from '@/shared/screens/MenuScreen/MenuScreen.types'

export const MENU_ACCENT = {
  SUDOKU: 'sudoku',
  SOLITAIRE: 'solitaire',
  TWO_TONE: 'twoTone',
  SIGHTLINES: 'sightlines',
  FIVE_LETTERS: 'fiveLetters',
  KAKURO: 'kakuro',
  SLIDE_OUT: 'slideOut',
  WORD_WHEEL: 'wordWheel',
} as const

export const MENU_ACCENT_CLASS: Record<MenuAccent, string> = {
  [MENU_ACCENT.SUDOKU]: '[--game:var(--sd-accent)]',
  [MENU_ACCENT.SOLITAIRE]: '[--game:var(--sol-accent)]',
  [MENU_ACCENT.TWO_TONE]: '[--game:var(--tt-accent)]',
  [MENU_ACCENT.SIGHTLINES]: '[--game:var(--sl-accent)]',
  [MENU_ACCENT.FIVE_LETTERS]: '[--game:var(--fl-accent)]',
  [MENU_ACCENT.KAKURO]: '[--game:var(--kk-accent)]',
  [MENU_ACCENT.SLIDE_OUT]: '[--game:var(--so-accent)]',
  [MENU_ACCENT.WORD_WHEEL]: '[--game:var(--ww-accent)]',
}
