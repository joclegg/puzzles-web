import { BarChart3, CalendarDays, History, Settings } from 'lucide-react'
import { useState } from 'react'

import { todayIso } from '@/common/date.functions'
import { formatDuration } from '@/common/format.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useStoredState } from '@/common/storage.hooks'
import {
  DIFFICULTY_LABEL,
  GAME_MODE,
  GAME_MODE_LABEL,
  GAME_MODES,
  LEVELS,
} from '@/common/sudoku/sudoku.constants'
import { useSudokuGames } from '@/common/sudoku/sudoku.hooks'
import type { Difficulty, GameMode } from '@/common/sudoku/sudoku.types'
import {
  dailyPick,
  dailySudokuId,
  parseDailyId,
} from '@/common/sudoku/sudokuBank.functions'
import { SUDOKU_STATUS, TITLE } from '@/common/sudoku/sudokuSaves.constants'
import { sudokuTitle } from '@/common/sudoku/sudokuSaves.functions'
import type { SavedSudoku } from '@/common/sudoku/sudokuSaves.types'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { OptionGroup } from '@/components/OptionGroup/OptionGroup'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SudokuHomeView() {
  const { games, openGame, startLevel, openDaily } = useSudokuGames()
  const [mode, setMode] = useStoredState<GameMode>({
    key: 'sudoku.homeMode',
    fallback: GAME_MODE.CLASSIC,
  })
  const [resumeChoice, setResumeChoice] = useState<SavedSudoku | null>(null)
  const [loading, setLoading] = useState(false)
  const today = todayIso()
  const inProgress = games
    .filter((game) => game.status === SUDOKU_STATUS.IN_PROGRESS)
    .sort((a, b) => b.startedAt - a.startedAt)
  const latest = inProgress[0]
  const dailyId = dailySudokuId({ mode, date: today })
  const dailyDone = games.some(
    (game) =>
      game.puzzleId === dailyId && game.status === SUDOKU_STATUS.COMPLETED,
  )

  function load(start: () => Promise<void>) {
    if (loading) {
      return
    }
    setLoading(true)
    start().finally(() => setLoading(false))
  }

  function savedFor(difficulty: Difficulty) {
    return inProgress.find(
      (game) =>
        game.mode === mode &&
        game.difficulty === difficulty &&
        !game.custom &&
        parseDailyId(game.puzzleId) === null,
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-8">
      <ScreenHeader title={TITLE} back={[]}>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Best times"
          onClick={() => navigate([GAME_ROUTE.SUDOKU, SCREEN.STATS])}
        >
          <BarChart3 className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="History"
          onClick={() => navigate([GAME_ROUTE.SUDOKU, SCREEN.HISTORY])}
        >
          <History className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Settings"
          onClick={() => navigate([GAME_ROUTE.SUDOKU, SCREEN.SETTINGS])}
        >
          <Settings className="size-5" />
        </Button>
      </ScreenHeader>
      {latest && (
        <button
          type="button"
          onClick={() => openGame(latest)}
          className="rounded-xl bg-card p-4 text-left ring-1 ring-border hover:bg-muted"
        >
          <span className="block font-semibold">Continue</span>
          <span className="block text-sm text-muted-foreground">
            {sudokuTitle(latest)} · {formatDuration(latest.elapsedMs)}
          </span>
        </button>
      )}
      <OptionGroup
        label="Mode"
        options={GAME_MODES}
        value={mode}
        labels={GAME_MODE_LABEL}
        onChange={(next) => setMode(() => next)}
      />
      <div className="flex gap-2">
        <Button
          variant={BUTTON_VARIANT.OUTLINE}
          className="h-12 flex-1 text-base"
          disabled={loading}
          onClick={() => load(() => openDaily({ mode, date: today }))}
        >
          Daily puzzle ·{' '}
          {DIFFICULTY_LABEL[dailyPick({ mode, date: today }).difficulty]}
          {dailyDone ? ' ✓' : ''}
        </Button>
        <Button
          variant={BUTTON_VARIANT.OUTLINE}
          size={BUTTON_SIZE.ICON}
          className="size-12"
          aria-label="Daily calendar"
          onClick={() => navigate([GAME_ROUTE.SUDOKU, SCREEN.DAILY])}
        >
          <CalendarDays className="size-5" />
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {LEVELS[mode].map((difficulty) => {
          const saved = savedFor(difficulty)
          return (
            <Button
              key={difficulty}
              variant={BUTTON_VARIANT.OUTLINE}
              className="h-auto flex-col py-3"
              disabled={loading}
              onClick={() =>
                saved
                  ? setResumeChoice(saved)
                  : load(() => startLevel({ mode, difficulty }))
              }
            >
              <span className="text-base">{DIFFICULTY_LABEL[difficulty]}</span>
              {saved && (
                <span className="text-xs text-muted-foreground">
                  In progress · {formatDuration(saved.elapsedMs)}
                </span>
              )}
            </Button>
          )
        })}
      </div>
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        className="h-11"
        onClick={() => navigate([GAME_ROUTE.SUDOKU, SCREEN.ENTRY])}
      >
        Enter puzzle
      </Button>
      <AppDialog
        open={resumeChoice !== null}
        title={resumeChoice ? sudokuTitle(resumeChoice) : ''}
        onClose={() => setResumeChoice(null)}
        actions={
          <>
            <Button
              onClick={() => {
                const choice = resumeChoice!
                setResumeChoice(null)
                load(() =>
                  startLevel({
                    mode: choice.mode,
                    difficulty: choice.difficulty!,
                  }),
                )
              }}
            >
              New game
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => {
                setResumeChoice(null)
                openGame(resumeChoice!)
              }}
            >
              Resume
            </Button>
          </>
        }
      >
        <p>
          You have a game in progress (
          {formatDuration(resumeChoice?.elapsedMs ?? 0)}).
        </p>
      </AppDialog>
    </main>
  )
}
