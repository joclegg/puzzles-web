import { BarChart3, History, Settings } from 'lucide-react'
import { useState } from 'react'

import { todayIso } from '@/common/date.functions'
import { formatDuration } from '@/common/format.functions'
import {
  dailyPuzzleId,
  inProgressPuzzles,
  isDailyPuzzle,
} from '@/common/puzzleSaves.functions'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import { puzzleTitle, sizeLabel } from '@/common/puzzleTitle.functions'
import { PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { SIZES } from '@/common/kakuro/kakuro.constants'
import { useKakuroGames } from '@/common/kakuro/kakuro.hooks'
import { TITLE } from '@/common/kakuro/kakuroSettings.constants'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function KakuroHomeView() {
  const { games, openGame, startRandom, openDaily } = useKakuroGames()
  const [resumeChoice, setResumeChoice] = useState<SavedPuzzle | null>(null)
  const today = todayIso()
  const inProgress = inProgressPuzzles(games)
  const latest = inProgress[0]
  const dailySolved = new Set(
    games
      .filter((game) => game.status === PUZZLE_STATUS.SOLVED)
      .map((game) => game.puzzleId),
  )

  function savedFor(size: number) {
    return inProgress.find(
      (game) => game.size === size && !isDailyPuzzle(game.puzzleId),
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-8">
      <ScreenHeader title={TITLE} back={[]}>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Stats"
          onClick={() => navigate([GAME_ROUTE.KAKURO, SCREEN.STATS])}
        >
          <BarChart3 className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="History"
          onClick={() => navigate([GAME_ROUTE.KAKURO, SCREEN.HISTORY])}
        >
          <History className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Settings"
          onClick={() => navigate([GAME_ROUTE.KAKURO, SCREEN.SETTINGS])}
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
            {puzzleTitle(latest)} · {formatDuration(latest.elapsedMs)}
          </span>
        </button>
      )}
      <div className="grid grid-cols-2 gap-2">
        {SIZES.map((size) => {
          const saved = savedFor(size)
          return (
            <Button
              key={size}
              variant={BUTTON_VARIANT.OUTLINE}
              className="h-auto flex-col py-3"
              onClick={() =>
                saved ? setResumeChoice(saved) : startRandom(size)
              }
            >
              <span className="text-base">{sizeLabel(size)}</span>
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
        {SIZES.map((size) => (
          <Button
            key={size}
            variant={BUTTON_VARIANT.OUTLINE}
            className="h-11 flex-1"
            aria-label={`Daily ${sizeLabel(size)}`}
            onClick={() => openDaily({ date: today, size })}
          >
            {dailySolved.has(dailyPuzzleId({ date: today, size }))
              ? `${size} ✓`
              : size}
          </Button>
        ))}
      </div>
      <AppDialog
        open={resumeChoice !== null}
        title={resumeChoice ? puzzleTitle(resumeChoice) : ''}
        onClose={() => setResumeChoice(null)}
        actions={
          <>
            <Button
              onClick={() => {
                setResumeChoice(null)
                startRandom(resumeChoice!.size)
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
