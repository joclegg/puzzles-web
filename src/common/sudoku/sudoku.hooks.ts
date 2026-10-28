import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { readStored } from '@/common/storage.functions'
import { useStoredState } from '@/common/storage.hooks'
import type { Difficulty, GameMode } from '@/common/sudoku/sudoku.types'
import {
  bankFile,
  chunkOf,
  dailyPick,
  dailySudokuId,
  nextUnplayedIndex,
} from '@/common/sudoku/sudokuBank.functions'
import {
  DEFAULT_SETTINGS,
  GAMES_KEY,
  SETTINGS_KEY,
  SUDOKU_STATUS,
} from '@/common/sudoku/sudokuSaves.constants'
import {
  finishSudoku,
  playedIds,
  startSudoku,
} from '@/common/sudoku/sudokuSaves.functions'
import type {
  SavedSudoku,
  SudokuRef,
  SudokuSettings,
  SudokuStatus,
} from '@/common/sudoku/sudokuSaves.types'

export function useSudokuGames() {
  const [games, setGames] = useStoredState<SavedSudoku[]>({
    key: GAMES_KEY,
    fallback: [],
  })

  function openGame(game: SavedSudoku) {
    navigate([GAME_ROUTE.SUDOKU, SCREEN.GAME, game.id])
  }

  function startAndOpen(ref: SudokuRef) {
    const settings = readStored<SudokuSettings>({
      key: SETTINGS_KEY,
      fallback: DEFAULT_SETTINGS,
    })
    const created = startSudoku({
      id: crypto.randomUUID(),
      games: readStored<SavedSudoku[]>({ key: GAMES_KEY, fallback: [] }),
      ref,
      mistakeCheck: settings[ref.mode].mistakeCheck,
      now: Date.now(),
    })
    setGames(() => created.games)
    openGame(created.game)
  }

  async function startLevel({
    mode,
    difficulty,
  }: {
    mode: GameMode
    difficulty: Difficulty
  }) {
    const index = nextUnplayedIndex({
      mode,
      difficulty,
      played: playedIds({ games, mode }),
    })
    const file = bankFile({ mode, difficulty })
    startAndOpen({
      puzzleId: `${file}:${index}`,
      mode,
      difficulty,
      custom: false,
      puzzle: await fetchBankLine({ file, index }),
    })
  }

  async function openDaily({ mode, date }: { mode: GameMode; date: string }) {
    const puzzleId = dailySudokuId({ mode, date })
    const existing = games.findLast(
      (game) =>
        game.puzzleId === puzzleId && game.status === SUDOKU_STATUS.IN_PROGRESS,
    )
    if (existing) {
      openGame(existing)
      return
    }
    const { difficulty, index } = dailyPick({ mode, date })
    startAndOpen({
      puzzleId,
      mode,
      difficulty,
      custom: false,
      puzzle: await fetchBankLine({
        file: bankFile({ mode, difficulty }),
        index,
      }),
    })
  }

  function saveProgress({
    id,
    patch,
  }: {
    id: string
    patch: Partial<SavedSudoku>
  }) {
    setGames((all) =>
      all.map((game) => (game.id === id ? { ...game, ...patch } : game)),
    )
  }

  function finish({
    id,
    status,
    patch,
  }: {
    id: string
    status: SudokuStatus
    patch: Partial<SavedSudoku>
  }): boolean {
    const result = finishSudoku({ games, id, status, patch, now: Date.now() })
    setGames(() => result.games)
    return result.newBest
  }

  return {
    games,
    openGame,
    startLevel,
    openDaily,
    startAndOpen,
    saveProgress,
    finish,
  }
}

async function fetchBankLine({ file, index }: { file: string; index: number }) {
  const { chunk, line } = chunkOf(index)
  const response = await fetch(
    `${import.meta.env.BASE_URL}sudoku/${file}/${chunk}.txt`,
  )
  const text = await response.text()
  return text.split('\n')[line]
}
