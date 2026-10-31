import { BarChart3, History, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { dailyPuzzleResults } from '@/common/puzzleSaves.functions'
import { DailyCalendarButton } from '@/components/DailyCalendarButton/DailyCalendarButton'
import { todayIso } from '@/common/date.functions'
import { formatDayMonth, formatDuration } from '@/common/format.functions'
import {
  dailyPuzzleId,
  inProgressPuzzles,
  isDailyPuzzle,
} from '@/common/puzzleSaves.functions'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import { puzzleTitle, sizeLabel } from '@/common/puzzleTitle.functions'
import { PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate, replaceRoute } from '@/common/route.hooks'
import { SIZES } from '@/common/sightlines/sightlines.constants'
import { useSightlinesGames } from '@/common/sightlines/sightlines.hooks'
import { TITLE } from '@/common/sightlines/sightlinesSettings.constants'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { ContinueCard } from '@/components/ContinueCard/ContinueCard'
import { DailyTile } from '@/components/DailyTile/DailyTile'
import { GameHero } from '@/components/GameHero/GameHero'
import { LevelDots } from '@/components/LevelDots/LevelDots'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { MenuSection } from '@/components/MenuSection/MenuSection'
import { MenuTile } from '@/components/MenuTile/MenuTile'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SightlinesIcon } from '@/components/SightlinesIcon/SightlinesIcon'

export function SightlinesHomeView({ play }: { play?: string }) {
  const { games, openGame, startRandom, openDaily } = useSightlinesGames()
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

  const playedRef = useRef(false)

  useEffect(() => {
    if (play === undefined || playedRef.current) return
    playedRef.current = true
    replaceRoute([GAME_ROUTE.SIGHTLINES])
    void openDaily({ date: today, size: Number(play) })
  }, [openDaily, play, today])

  return (
    <MenuScreen accent={MENU_ACCENT.SIGHTLINES}>
      <ScreenHeader title={TITLE} back={[]}>
        <DailyCalendarButton
          route={GAME_ROUTE.SIGHTLINES}
          results={dailyPuzzleResults(games)}
          total={SIZES.length}
        />
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Stats"
          onClick={() => navigate([GAME_ROUTE.SIGHTLINES, SCREEN.STATS])}
        >
          <BarChart3 className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="History"
          onClick={() => navigate([GAME_ROUTE.SIGHTLINES, SCREEN.HISTORY])}
        >
          <History className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Settings"
          onClick={() => navigate([GAME_ROUTE.SIGHTLINES, SCREEN.SETTINGS])}
        >
          <Settings className="size-5" />
        </Button>
      </ScreenHeader>
      <GameHero
        icon={<SightlinesIcon />}
        tagline="Blue dots count what they can see"
      />
      {latest && (
        <ContinueCard
          detail={`${puzzleTitle(latest)} · ${formatDuration(latest.elapsedMs)}`}
          onClick={() => openGame(latest)}
        />
      )}
      <MenuSection title="Today" aside={formatDayMonth(today)}>
        <div className="grid grid-cols-5 gap-2">
          {SIZES.map((size) => (
            <DailyTile
              key={size}
              label={sizeLabel(size)}
              ariaLabel={`Daily ${sizeLabel(size)}`}
              done={dailySolved.has(dailyPuzzleId({ date: today, size }))}
              onClick={() => openDaily({ date: today, size })}
            />
          ))}
        </div>
      </MenuSection>
      <MenuSection title="New puzzle">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SIZES.map((size, rank) => {
            const saved = savedFor(size)
            return (
              <MenuTile
                key={size}
                label={sizeLabel(size)}
                meter={<LevelDots rank={rank} count={SIZES.length} />}
                detail={
                  saved
                    ? `In progress · ${formatDuration(saved.elapsedMs)}`
                    : undefined
                }
                active={saved !== undefined}
                onClick={() =>
                  saved ? setResumeChoice(saved) : startRandom(size)
                }
              />
            )
          })}
        </div>
      </MenuSection>
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
    </MenuScreen>
  )
}
