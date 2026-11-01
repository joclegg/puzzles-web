import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { todayIso } from '@/shared/lib/date.functions'
import { formatDayMonth, formatDuration } from '@/shared/lib/format.functions'
import type { GameDefinition, PuzzleOptions } from '@/shared/game/game.types'
import { PUZZLE_STATUS } from '@/shared/game/puzzleSaves.constants'
import {
  dailyPuzzleResults,
  inProgressPuzzles,
  isDailyPuzzle,
} from '@/shared/game/puzzleSaves.functions'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { replaceRoute } from '@/shared/lib/route.hooks'
import { AppDialog } from '@/shared/ui/AppDialog/AppDialog'
import { BankLoader } from '@/shared/bank/BankLoader/BankLoader'
import { useBankLoader } from '@/shared/bank/BankLoader/BankLoader.hooks'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_VARIANT } from '@/shared/ui/Button/Button.constants'
import { ContinueCard } from '@/shared/screens/ContinueCard/ContinueCard'
import { DailyTile } from '@/shared/screens/DailyTile/DailyTile'
import { HomeScreen } from '@/shared/screens/HomeScreen/HomeScreen'
import { LevelDots } from '@/shared/screens/LevelDots/LevelDots'
import { MenuSection } from '@/shared/screens/MenuSection/MenuSection'
import { MenuTile } from '@/shared/screens/MenuTile/MenuTile'

export function PuzzleHomeView<T extends number | string>({
  definition,
  title,
  icon,
  tagline,
  options,
  dailyGridClass,
  usesBank,
  play,
  playValue,
  games,
  openGame,
  startRandom,
  openDaily,
}: {
  definition: GameDefinition
  title: string
  icon: ReactNode
  tagline: string
  options: PuzzleOptions<T>
  dailyGridClass: string
  usesBank: boolean
  play?: string
  playValue: (play: string) => T
  games: SavedPuzzle[]
  openGame: (game: SavedPuzzle) => void
  startRandom: (value: T) => Promise<void> | void
  openDaily: (choice: { date: string; value: T }) => Promise<void> | void
}) {
  const bank = useBankLoader()
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

  function load(task: () => Promise<void> | void) {
    if (usesBank) {
      bank.run(async () => task())
    } else {
      void task()
    }
  }

  function savedFor(value: T) {
    return inProgress.find(
      (game) => options.of(game) === value && !isDailyPuzzle(game.puzzleId),
    )
  }

  useEffect(() => {
    if (play === undefined || playedRef.current) return
    playedRef.current = true
    replaceRoute([definition.id])
    const value = playValue(play)
    if (usesBank) {
      bank.run(async () => openDaily({ date: today, value }))
    } else {
      void openDaily({ date: today, value })
    }
  }, [bank, definition.id, openDaily, play, playValue, today, usesBank])

  return (
    <HomeScreen
      definition={definition}
      title={title}
      icon={icon}
      tagline={tagline}
      dailyResults={dailyPuzzleResults(games)}
      dailyTotal={options.values.length}
    >
      {latest && (
        <ContinueCard
          detail={`${options.title(latest)} · ${formatDuration(latest.elapsedMs)}`}
          onClick={() => openGame(latest)}
        />
      )}
      <MenuSection title="Today" aside={formatDayMonth(today)}>
        <div className={dailyGridClass}>
          {options.values.map((value) => (
            <DailyTile
              key={value}
              label={options.label(value)}
              ariaLabel={`Daily ${options.label(value)}`}
              done={solvedIds.has(options.dailyId({ date: today, value }))}
              onClick={() => load(() => openDaily({ date: today, value }))}
            />
          ))}
        </div>
      </MenuSection>
      <MenuSection title="New puzzle">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {options.values.map((value, rank) => {
            const saved = savedFor(value)
            return (
              <MenuTile
                key={value}
                label={options.label(value)}
                meter={<LevelDots rank={rank} count={options.values.length} />}
                detail={
                  saved
                    ? `In progress · ${formatDuration(saved.elapsedMs)}`
                    : undefined
                }
                active={saved !== undefined}
                onClick={() =>
                  saved
                    ? setResumeChoice(saved)
                    : load(() => startRandom(value))
                }
              />
            )
          })}
        </div>
      </MenuSection>
      <AppDialog
        open={resumeChoice !== null}
        title={resumeChoice ? options.title(resumeChoice) : ''}
        onClose={() => setResumeChoice(null)}
        actions={
          <>
            <Button
              onClick={() => {
                setResumeChoice(null)
                load(() => startRandom(options.of(resumeChoice!)))
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
      {usesBank && <BankLoader load={bank} />}
    </HomeScreen>
  )
}
