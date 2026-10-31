import { BarChart3, History, Settings } from 'lucide-react'
import { dailyPuzzleResults } from '@/common/puzzleSaves.functions'
import { DailyCalendarButton } from '@/components/DailyCalendarButton/DailyCalendarButton'
import type { Level } from '@/common/slideOut/slideOut.types'
import { useEffect, useRef, useState } from 'react'

import { todayIso } from '@/common/date.functions'
import { formatDayMonth, formatDuration } from '@/common/format.functions'
import { DAILY_PREFIX, PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import {
  inProgressPuzzles,
  isDailyPuzzle,
} from '@/common/puzzleSaves.functions'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate, replaceRoute } from '@/common/route.hooks'
import { LEVEL_LABEL, LEVELS } from '@/common/slideOut/slideOut.constants'
import { useSlideOutGames } from '@/common/slideOut/slideOut.hooks'
import { TITLE } from '@/common/slideOut/slideOutSaves.constants'
import {
  levelOf,
  slideOutTitle,
} from '@/common/slideOut/slideOutSaves.functions'
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
import { SlideOutIcon } from '@/components/SlideOutIcon/SlideOutIcon'

export function SlideOutHomeView({ play }: { play?: string }) {
  const { games, openGame, startRandom, openDaily } = useSlideOutGames()
  const [resumeChoice, setResumeChoice] = useState<SavedPuzzle | null>(null)
  const today = todayIso()
  const inProgress = inProgressPuzzles(games)
  const latest = inProgress[0]
  const solvedIds = new Set(
    games
      .filter((game) => game.status === PUZZLE_STATUS.SOLVED)
      .map((game) => game.puzzleId),
  )

  const playedRef = useRef(false)

  useEffect(() => {
    if (play === undefined || playedRef.current) return
    playedRef.current = true
    replaceRoute([GAME_ROUTE.SLIDE_OUT])
    void openDaily({ date: today, level: play as Level })
  }, [openDaily, play, today])

  return (
    <MenuScreen accent={MENU_ACCENT.SLIDE_OUT}>
      <ScreenHeader title={TITLE} back={[]}>
        <DailyCalendarButton
          route={GAME_ROUTE.SLIDE_OUT}
          results={dailyPuzzleResults(games)}
          total={LEVELS.length}
        />
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Stats"
          onClick={() => navigate([GAME_ROUTE.SLIDE_OUT, SCREEN.STATS])}
        >
          <BarChart3 className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="History"
          onClick={() => navigate([GAME_ROUTE.SLIDE_OUT, SCREEN.HISTORY])}
        >
          <History className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Settings"
          onClick={() => navigate([GAME_ROUTE.SLIDE_OUT, SCREEN.SETTINGS])}
        >
          <Settings className="size-5" />
        </Button>
      </ScreenHeader>
      <GameHero
        icon={<SlideOutIcon />}
        tagline="Slide the blocks to free the red one"
      />
      {latest && (
        <ContinueCard
          detail={`${slideOutTitle(latest)} · ${formatDuration(latest.elapsedMs)}`}
          onClick={() => openGame(latest)}
        />
      )}
      <MenuSection title="Today" aside={formatDayMonth(today)}>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((level) => (
            <DailyTile
              key={level}
              label={LEVEL_LABEL[level]}
              ariaLabel={`Daily ${LEVEL_LABEL[level]}`}
              done={solvedIds.has(`${DAILY_PREFIX}${today}_${level}`)}
              onClick={() => openDaily({ date: today, level })}
            />
          ))}
        </div>
      </MenuSection>
      <MenuSection title="New puzzle">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LEVELS.map((level, rank) => {
            const saved = inProgress.find(
              (game) =>
                levelOf(game) === level && !isDailyPuzzle(game.puzzleId),
            )
            return (
              <MenuTile
                key={level}
                label={LEVEL_LABEL[level]}
                meter={<LevelDots rank={rank} count={LEVELS.length} />}
                detail={
                  saved
                    ? `In progress · ${formatDuration(saved.elapsedMs)}`
                    : undefined
                }
                active={saved !== undefined}
                onClick={() =>
                  saved ? setResumeChoice(saved) : startRandom(level)
                }
              />
            )
          })}
        </div>
      </MenuSection>
      <AppDialog
        open={resumeChoice !== null}
        title={resumeChoice ? slideOutTitle(resumeChoice) : ''}
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
    </MenuScreen>
  )
}
