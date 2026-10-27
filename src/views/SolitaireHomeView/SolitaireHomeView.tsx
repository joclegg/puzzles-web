import { BarChart3, History, Settings } from 'lucide-react'
import { useState } from 'react'

import { todayIso } from '@/common/date.functions'
import { formatDuration } from '@/common/format.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { useSolitaireGames } from '@/common/solitaire/solitaire.hooks'
import {
  DAILY_PREFIX,
  DEAL_STATUS,
  TITLE,
} from '@/common/solitaire/solitaireSaves.constants'
import {
  dealTitle,
  isDailyDeal,
} from '@/common/solitaire/solitaireSaves.functions'
import type { SavedDeal } from '@/common/solitaire/solitaireSaves.types'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SolitaireHomeView() {
  const { games, openGame, startRandom, openDaily } = useSolitaireGames()
  const [resumeChoice, setResumeChoice] = useState<SavedDeal | null>(null)
  const [dealing, setDealing] = useState(false)
  const today = todayIso()
  const inProgress = games
    .filter((game) => game.status === DEAL_STATUS.IN_PROGRESS)
    .sort((a, b) => b.startedAt - a.startedAt)
  const latest = inProgress[0]
  const random = inProgress.find((game) => !isDailyDeal(game.dealId))
  const daily = games.findLast(
    (game) => game.dealId === `${DAILY_PREFIX}${today}`,
  )

  function deal(start: () => Promise<void>) {
    if (dealing) {
      return
    }
    setDealing(true)
    start().finally(() => setDealing(false))
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-8">
      <ScreenHeader title={TITLE} back={[]}>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Stats"
          onClick={() => navigate([GAME_ROUTE.SOLITAIRE, SCREEN.STATS])}
        >
          <BarChart3 className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="History"
          onClick={() => navigate([GAME_ROUTE.SOLITAIRE, SCREEN.HISTORY])}
        >
          <History className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Settings"
          onClick={() => navigate([GAME_ROUTE.SOLITAIRE, SCREEN.SETTINGS])}
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
            {dealTitle(latest)} · {formatDuration(latest.elapsedMs)} ·{' '}
            {latest.moveCount} moves
          </span>
        </button>
      )}
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        className="h-auto flex-col py-4 text-base"
        disabled={dealing}
        onClick={() => (random ? setResumeChoice(random) : deal(startRandom))}
      >
        <span>{dealing ? 'Dealing…' : 'New game'}</span>
        {random && (
          <span className="text-xs text-muted-foreground">
            In progress · {formatDuration(random.elapsedMs)}
          </span>
        )}
      </Button>
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        className="h-12 text-base"
        disabled={dealing}
        onClick={() => deal(() => openDaily(today))}
      >
        {daily?.status === DEAL_STATUS.WON
          ? 'Daily deal · Won ✓'
          : 'Daily deal'}
      </Button>
      <AppDialog
        open={resumeChoice !== null}
        title={resumeChoice ? dealTitle(resumeChoice) : ''}
        onClose={() => setResumeChoice(null)}
        actions={
          <>
            <Button
              onClick={() => {
                setResumeChoice(null)
                deal(startRandom)
              }}
            >
              New deal
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
