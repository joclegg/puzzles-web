import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import { readStored } from '@/shared/storage/storage.functions'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { fetchBank } from '@/shared/bank/bank.hooks'
import type { Difficulty, GameMode } from '@/games/sudoku/engine/sudoku.types'
import {
  bankFile,
  dailyIndex,
  dailySudokuId,
  nextUnplayedIndex,
} from '@/games/sudoku/engine/sudokuBank.functions'
import {
  DEFAULT_SETTINGS,
  GAMES_KEY,
  SETTINGS_KEY,
  SUDOKU_STATUS,
} from '@/games/sudoku/engine/sudokuSaves.constants'
import {
  finishSudoku,
  playedIds,
  startSudoku,
} from '@/games/sudoku/engine/sudokuSaves.functions'
import type {
  SavedSudoku,
  SudokuRef,
  SudokuSettings,
  SudokuStatus,
} from '@/games/sudoku/engine/sudokuSaves.types'

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

  async function openDaily({
    mode,
    difficulty,
    date,
  }: {
    mode: GameMode
    difficulty: Difficulty
    date: string
  }) {
    const puzzleId = dailySudokuId({ mode, difficulty, date })
    const existing = games.findLast(
      (game) =>
        game.puzzleId === puzzleId && game.status === SUDOKU_STATUS.IN_PROGRESS,
    )
    if (existing) {
      openGame(existing)
      return
    }
    startAndOpen({
      puzzleId,
      mode,
      difficulty,
      custom: false,
      puzzle: await fetchBankLine({
        file: bankFile({ mode, difficulty }),
        index: dailyIndex({ mode, difficulty, date }),
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
  const text = await fetchBank(`sudoku/${file}.txt`)
  return text.split('\n')[index]
}
