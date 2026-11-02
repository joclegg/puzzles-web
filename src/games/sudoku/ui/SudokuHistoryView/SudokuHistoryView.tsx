import { DEFINITION } from '@/games/sudoku/definition'
import {
  GAME_MODE_LABEL,
  GAME_MODES,
} from '@/games/sudoku/engine/sudoku.constants'
import { useSudokuGames } from '@/games/sudoku/engine/sudoku.hooks'
import { SUDOKU_STATUS_LABEL } from '@/games/sudoku/engine/sudokuSaves.constants'
import { sudokuTitle } from '@/games/sudoku/engine/sudokuSaves.functions'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'

export function SudokuHistoryView() {
  const { games } = useSudokuGames()
  return (
    <PuzzleHistoryView
      definition={DEFINITION}
      games={games}
      options={{
        filterName: 'Mode',
        values: GAME_MODES,
        filterLabel: (mode) => GAME_MODE_LABEL[mode],
        of: (game) => game.mode,
        title: sudokuTitle,
      }}
      detail={(game) =>
        `${SUDOKU_STATUS_LABEL[game.status]} · ${game.mistakes} mistakes`
      }
    />
  )
}
