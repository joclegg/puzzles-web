import { BankLoader } from '@/components/BankLoader/BankLoader'
import { BANK_LOAD } from '@/components/BankLoader/BankLoader.constants'
import { useBankLoader } from '@/components/BankLoader/BankLoader.hooks'
import { PenLine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { dailyResults } from '@/common/sudoku/sudokuSaves.functions'
import { todayIso } from '@/common/date.functions'
import { formatDayMonth, formatDuration } from '@/common/format.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate, replaceRoute } from '@/common/route.hooks'
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
  dailySudokuId,
  parseDailyId,
} from '@/common/sudoku/sudokuBank.functions'
import { SUDOKU_STATUS, TITLE } from '@/common/sudoku/sudokuSaves.constants'
import { sudokuTitle } from '@/common/sudoku/sudokuSaves.functions'
import type { SavedSudoku } from '@/common/sudoku/sudokuSaves.types'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import { BUTTON_VARIANT } from '@/components/Button/Button.constants'
import { OptionGroup } from '@/components/OptionGroup/OptionGroup'
import { ContinueCard } from '@/components/ContinueCard/ContinueCard'
import { DailyTile } from '@/components/DailyTile/DailyTile'
import { LevelDots } from '@/components/LevelDots/LevelDots'
import { MenuSection } from '@/components/MenuSection/MenuSection'
import { MenuTile } from '@/components/MenuTile/MenuTile'
import { SudokuIcon } from '@/components/SudokuIcon/SudokuIcon'
import { HomeScreen } from '@/components/HomeScreen/HomeScreen'
import { gameDefinition } from '@/common/game.functions'

const DEFINITION = gameDefinition(GAME_ROUTE.SUDOKU)

export function SudokuHomeView({ play }: { play?: string }) {
  const { games, openGame, startLevel, openDaily } = useSudokuGames()
  const [mode, setMode] = useStoredState<GameMode>({
    key: 'sudoku.homeMode',
    fallback: GAME_MODE.CLASSIC,
  })
  const [resumeChoice, setResumeChoice] = useState<SavedSudoku | null>(null)
  const bank = useBankLoader()
  const loading = bank.status === BANK_LOAD.LOADING
  const today = todayIso()
  const inProgress = games
    .filter((game) => game.status === SUDOKU_STATUS.IN_PROGRESS)
    .sort((a, b) => b.startedAt - a.startedAt)
  const latest = inProgress[0]

  function dailyDone(difficulty: Difficulty) {
    const dailyId = dailySudokuId({ mode, difficulty, date: today })
    return games.some(
      (game) =>
        game.puzzleId === dailyId && game.status === SUDOKU_STATUS.COMPLETED,
    )
  }

  function load(start: () => Promise<void>) {
    bank.run(start)
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

  const playedRef = useRef(false)

  useEffect(() => {
    if (play === undefined || playedRef.current) return
    playedRef.current = true
    replaceRoute([GAME_ROUTE.SUDOKU])
    const [playMode, playDifficulty] = play.split('_')
    bank.run(() =>
      openDaily({
        mode: playMode as GameMode,
        difficulty: playDifficulty as Difficulty,
        date: today,
      }),
    )
  }, [bank, openDaily, play, today])

  return (
    <HomeScreen
      definition={DEFINITION}
      title={TITLE}
      icon={<SudokuIcon />}
      tagline="Classic and killer, from 6x6 to evil"
      dailyResults={dailyResults(games)}
      dailyTotal={GAME_MODES.flatMap((each) => LEVELS[each]).length}
      statsLabel="Best times"
    >
      {latest && (
        <ContinueCard
          detail={`${sudokuTitle(latest)} · ${formatDuration(latest.elapsedMs)}`}
          onClick={() => openGame(latest)}
        />
      )}
      <OptionGroup
        label="Mode"
        options={GAME_MODES}
        value={mode}
        labels={GAME_MODE_LABEL}
        onChange={(next) => setMode(() => next)}
      />
      <MenuSection title="Today" aside={formatDayMonth(today)}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {LEVELS[mode].map((difficulty) => (
            <DailyTile
              key={difficulty}
              label={DIFFICULTY_LABEL[difficulty]}
              ariaLabel={`Daily ${DIFFICULTY_LABEL[difficulty]}`}
              done={dailyDone(difficulty)}
              onClick={() =>
                load(() => openDaily({ mode, difficulty, date: today }))
              }
            />
          ))}
        </div>
      </MenuSection>
      <MenuSection title="New game">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LEVELS[mode].map((difficulty, rank) => {
            const saved = savedFor(difficulty)
            return (
              <MenuTile
                key={difficulty}
                label={DIFFICULTY_LABEL[difficulty]}
                meter={<LevelDots rank={rank} count={LEVELS[mode].length} />}
                detail={
                  saved
                    ? `In progress · ${formatDuration(saved.elapsedMs)}`
                    : undefined
                }
                active={saved !== undefined}
                disabled={loading}
                onClick={() =>
                  saved
                    ? setResumeChoice(saved)
                    : load(() => startLevel({ mode, difficulty }))
                }
              />
            )
          })}
        </div>
        <MenuTile
          label="Enter puzzle"
          icon={<PenLine className="size-5" />}
          onClick={() => navigate([GAME_ROUTE.SUDOKU, SCREEN.ENTRY])}
        />
      </MenuSection>
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
      <BankLoader load={bank} />
    </HomeScreen>
  )
}
