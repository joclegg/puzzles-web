import { BarChart3, History, Settings } from 'lucide-react'
import { useState } from 'react'

import { todayIso } from '@/common/date.functions'
import { formatDuration } from '@/common/format.functions'
import { DAILY_PREFIX, PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import {
  inProgressPuzzles,
  isDailyPuzzle,
} from '@/common/puzzleSaves.functions'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { LEVEL_LETTERS, LEVELS } from '@/common/wordWheel/wordWheel.constants'
import { useWordWheelGames } from '@/common/wordWheel/wordWheel.hooks'
import { TITLE } from '@/common/wordWheel/wordWheelSaves.constants'
import {
  levelLabel,
  levelOf,
  wordWheelTitle,
} from '@/common/wordWheel/wordWheelSaves.functions'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function WordWheelHomeView() {
  const { games, openGame, startRandom, openDaily } = useWordWheelGames()
  const [resumeChoice, setResumeChoice] = useState<SavedPuzzle | null>(null)
  const today = todayIso()
  const inProgress = inProgressPuzzles(games)
  const latest = inProgress[0]
  const solvedIds = new Set(
    games
      .filter((game) => game.status === PUZZLE_STATUS.SOLVED)
      .map((game) => game.puzzleId),
  )

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-8">
      <ScreenHeader title={TITLE} back={[]}>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Stats"
          onClick={() => navigate([GAME_ROUTE.WORD_WHEEL, SCREEN.STATS])}
        >
          <BarChart3 className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="History"
          onClick={() => navigate([GAME_ROUTE.WORD_WHEEL, SCREEN.HISTORY])}
        >
          <History className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Settings"
          onClick={() => navigate([GAME_ROUTE.WORD_WHEEL, SCREEN.SETTINGS])}
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
            {wordWheelTitle(latest)} · {formatDuration(latest.elapsedMs)}
          </span>
        </button>
      )}
      <div className="flex flex-col gap-2">
        {LEVELS.map((level) => {
          const saved = inProgress.find(
            (game) => levelOf(game) === level && !isDailyPuzzle(game.puzzleId),
          )
          return (
            <Button
              key={level}
              variant={BUTTON_VARIANT.OUTLINE}
              className="h-auto flex-col py-3"
              onClick={() =>
                saved ? setResumeChoice(saved) : startRandom(level)
              }
            >
              <span className="text-base">{levelLabel(level)}</span>
              {saved && (
                <span className="text-xs text-muted-foreground">
                  In progress · {formatDuration(saved.elapsedMs)}
                </span>
              )}
            </Button>
          )
        })}
      </div>
      <h2 className="font-semibold">Today's puzzles</h2>
      <div className="flex gap-2">
        {LEVELS.map((level) => (
          <Button
            key={level}
            variant={BUTTON_VARIANT.OUTLINE}
            className="h-11 flex-1"
            aria-label={`Daily ${levelLabel(level)}`}
            onClick={() => openDaily({ date: today, level })}
          >
            {LEVEL_LETTERS[level]}
            {solvedIds.has(`${DAILY_PREFIX}${today}_${level}`) ? ' ✓' : ''}
          </Button>
        ))}
      </div>
      <AppDialog
        open={resumeChoice !== null}
        title={resumeChoice ? wordWheelTitle(resumeChoice) : ''}
        onClose={() => setResumeChoice(null)}
        actions={
          <>
            <Button
              onClick={() => {
                setResumeChoice(null)
                startRandom(levelOf(resumeChoice!))
              }}
            >
              New puzzle
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
          You have a puzzle in progress (
          {formatDuration(resumeChoice?.elapsedMs ?? 0)}).
        </p>
      </AppDialog>
    </main>
  )
}
