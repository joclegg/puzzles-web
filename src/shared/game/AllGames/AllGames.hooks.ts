import { GAMES_KEY as FIVE_LETTERS_KEY } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import type { SavedGame } from '@/games/fiveLetters/engine/fiveLettersSaves.types'
import { GAMES_KEY as KAKURO_KEY } from '@/games/kakuro/engine/kakuroSaves.constants'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { GAMES_KEY as SIGHTLINES_KEY } from '@/games/sightlines/engine/sightlinesSaves.constants'
import { GAMES_KEY as SLIDE_OUT_KEY } from '@/games/slideOut/engine/slideOutSaves.constants'
import { GAMES_KEY as SOLITAIRE_KEY } from '@/games/solitaire/engine/solitaireSaves.constants'
import type { SavedDeal } from '@/games/solitaire/engine/solitaireSaves.types'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { GAMES_KEY as SUDOKU_KEY } from '@/games/sudoku/engine/sudokuSaves.constants'
import type { SavedSudoku } from '@/games/sudoku/engine/sudokuSaves.types'
import { GAMES_KEY as TWO_TONE_KEY } from '@/games/twoTone/engine/twoToneSaves.constants'
import { GAMES_KEY as WORD_WHEEL_KEY } from '@/games/wordWheel/engine/wordWheelSaves.constants'
import type { AllSaves } from '@/shared/game/AllGames/AllGames.types'

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
