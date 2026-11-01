import { BankLoader } from '@/components/BankLoader/BankLoader'
import { BANK_LOAD } from '@/components/BankLoader/BankLoader.constants'
import { useBankLoader } from '@/components/BankLoader/BankLoader.hooks'
import {
  BarChart3,
  CalendarCheck,
  History,
  Layers,
  Settings,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { dailyResults } from '@/common/solitaire/solitaireSaves.functions'
import { DailyCalendarButton } from '@/components/DailyCalendarButton/DailyCalendarButton'
import { todayIso } from '@/common/date.functions'
import { formatDayMonth, formatDuration } from '@/common/format.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate, replaceRoute } from '@/common/route.hooks'
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
import { ContinueCard } from '@/components/ContinueCard/ContinueCard'
import { GameHero } from '@/components/GameHero/GameHero'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { MenuSection } from '@/components/MenuSection/MenuSection'
import { MenuTile } from '@/components/MenuTile/MenuTile'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SolitaireIcon } from '@/components/SolitaireIcon/SolitaireIcon'

export function SolitaireHomeView({ play }: { play?: string }) {
  const { games, openGame, startRandom, openDaily } = useSolitaireGames()
  const [resumeChoice, setResumeChoice] = useState<SavedDeal | null>(null)
  const bank = useBankLoader()
  const dealing = bank.status === BANK_LOAD.LOADING
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
    bank.run(start)
  }

  const playedRef = useRef(false)

  useEffect(() => {
    if (play === undefined || playedRef.current) return
    playedRef.current = true
    replaceRoute([GAME_ROUTE.SOLITAIRE])
    bank.run(() => openDaily(today))
  }, [bank, openDaily, play, today])

  return (
    <MenuScreen accent={MENU_ACCENT.SOLITAIRE}>
      <ScreenHeader title={TITLE} back={[]}>
        <DailyCalendarButton
          route={GAME_ROUTE.SOLITAIRE}
          results={dailyResults(games)}
          total={1}
        />
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
      <GameHero
        icon={<SolitaireIcon />}
        tagline="Klondike, draw 1 or 3, or reverse"
      />
      {latest && (
        <ContinueCard
          detail={`${dealTitle(latest)} · ${formatDuration(latest.elapsedMs)} · ${latest.moveCount} moves`}
          onClick={() => openGame(latest)}
        />
      )}
      <MenuSection title="Today" aside={formatDayMonth(today)}>
        <MenuTile
          label="Daily deal"
          icon={<CalendarCheck className="size-5" />}
          detail={daily?.status === DEAL_STATUS.WON ? 'Won' : undefined}
          done={daily?.status === DEAL_STATUS.WON}
          disabled={dealing}
          onClick={() => deal(() => openDaily(today))}
        />
      </MenuSection>
      <MenuSection title="New game">
        <MenuTile
          label={dealing ? 'Dealing…' : 'New game'}
          icon={<Layers className="size-5" />}
          detail={
            random
              ? `In progress · ${formatDuration(random.elapsedMs)}`
              : undefined
          }
          active={random !== undefined}
          disabled={dealing}
          onClick={() => (random ? setResumeChoice(random) : deal(startRandom))}
        />
      </MenuSection>
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
      <BankLoader load={bank} />
    </MenuScreen>
  )
}
