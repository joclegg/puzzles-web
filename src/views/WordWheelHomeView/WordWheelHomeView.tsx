import { BarChart3, History, Settings } from 'lucide-react'
import { useState } from 'react'

import { todayIso } from '@/common/date.functions'
import { formatDayMonth, formatDuration } from '@/common/format.functions'
import { DAILY_PREFIX, PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import {
  inProgressPuzzles,
  isDailyPuzzle,
} from '@/common/puzzleSaves.functions'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import { LEVELS } from '@/common/wordWheel/wordWheel.constants'
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
import { ContinueCard } from '@/components/ContinueCard/ContinueCard'
import { DailyTile } from '@/components/DailyTile/DailyTile'
import { GameHero } from '@/components/GameHero/GameHero'
import { LevelDots } from '@/components/LevelDots/LevelDots'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { MenuSection } from '@/components/MenuSection/MenuSection'
import { MenuTile } from '@/components/MenuTile/MenuTile'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { WordWheelIcon } from '@/components/WordWheelIcon/WordWheelIcon'

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
    <MenuScreen accent={MENU_ACCENT.WORD_WHEEL}>
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
      <GameHero
        icon={<WordWheelIcon />}
        tagline="Swipe the letters to fill the crossword"
      />
      {latest && (
        <ContinueCard
          detail={`${wordWheelTitle(latest)} · ${formatDuration(latest.elapsedMs)}`}
          onClick={() => openGame(latest)}
        />
      )}
      <MenuSection title="Today" aside={formatDayMonth(today)}>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((level) => (
            <DailyTile
              key={level}
              label={levelLabel(level)}
              ariaLabel={`Daily ${levelLabel(level)}`}
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
                label={levelLabel(level)}
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
    </MenuScreen>
  )
}
