import { GAMES_KEY as FIVE_LETTERS_KEY } from '@/common/fiveLetters/fiveLettersSaves.constants'
import type { SavedGame } from '@/common/fiveLetters/fiveLettersSaves.types'
import { GAMES_KEY as KAKURO_KEY } from '@/common/kakuro/kakuroSettings.constants'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import { GAMES_KEY as SIGHTLINES_KEY } from '@/common/sightlines/sightlinesSettings.constants'
import { GAMES_KEY as SLIDE_OUT_KEY } from '@/common/slideOut/slideOutSaves.constants'
import { GAMES_KEY as SOLITAIRE_KEY } from '@/common/solitaire/solitaireSaves.constants'
import type { SavedDeal } from '@/common/solitaire/solitaireSaves.types'
import { useStoredState } from '@/common/storage.hooks'
import { GAMES_KEY as SUDOKU_KEY } from '@/common/sudoku/sudokuSaves.constants'
import type { SavedSudoku } from '@/common/sudoku/sudokuSaves.types'
import { GAMES_KEY as TWO_TONE_KEY } from '@/common/twoTone/twoToneSettings.constants'
import { GAMES_KEY as WORD_WHEEL_KEY } from '@/common/wordWheel/wordWheelSaves.constants'
import type { AllSaves } from '@/components/AllGames/AllGames.types'

export function useAllSaves(): AllSaves {
  const [sudoku] = useStoredState<SavedSudoku[]>({
    key: SUDOKU_KEY,
    fallback: [],
  })
  const [solitaire] = useStoredState<SavedDeal[]>({
    key: SOLITAIRE_KEY,
    fallback: [],
  })
  const [twoTone] = useStoredState<SavedPuzzle[]>({
    key: TWO_TONE_KEY,
    fallback: [],
  })
  const [sightlines] = useStoredState<SavedPuzzle[]>({
    key: SIGHTLINES_KEY,
    fallback: [],
  })
  const [fiveLetters] = useStoredState<SavedGame[]>({
    key: FIVE_LETTERS_KEY,
    fallback: [],
  })
  const [kakuro] = useStoredState<SavedPuzzle[]>({
    key: KAKURO_KEY,
    fallback: [],
  })
  const [slideOut] = useStoredState<SavedPuzzle[]>({
    key: SLIDE_OUT_KEY,
    fallback: [],
  })
  const [wordWheel] = useStoredState<SavedPuzzle[]>({
    key: WORD_WHEEL_KEY,
    fallback: [],
  })
  return {
    sudoku,
    solitaire,
    twoTone,
    sightlines,
    fiveLetters,
    kakuro,
    slideOut,
    wordWheel,
  }
}
