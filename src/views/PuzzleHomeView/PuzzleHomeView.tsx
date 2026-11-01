import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { todayIso } from '@/common/date.functions'
import { formatDayMonth, formatDuration } from '@/common/format.functions'
import type { GameDefinition, PuzzleOptions } from '@/common/game.types'
import { PUZZLE_STATUS } from '@/common/puzzleSaves.constants'
import {
  dailyPuzzleResults,
  inProgressPuzzles,
  isDailyPuzzle,
} from '@/common/puzzleSaves.functions'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'
import { replaceRoute } from '@/common/route.hooks'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { BankLoader } from '@/components/BankLoader/BankLoader'
import { useBankLoader } from '@/components/BankLoader/BankLoader.hooks'
import { Button } from '@/components/Button/Button'
import { BUTTON_VARIANT } from '@/components/Button/Button.constants'
import { ContinueCard } from '@/components/ContinueCard/ContinueCard'
import { DailyTile } from '@/components/DailyTile/DailyTile'
import { HomeScreen } from '@/components/HomeScreen/HomeScreen'
import { LevelDots } from '@/components/LevelDots/LevelDots'
import { MenuSection } from '@/components/MenuSection/MenuSection'
import { MenuTile } from '@/components/MenuTile/MenuTile'

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
