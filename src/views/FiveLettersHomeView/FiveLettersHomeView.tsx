import {
  loadWords,
  useFiveLettersGames,
} from '@/common/fiveLetters/fiveLetters.hooks'
import { CalendarCheck, Dumbbell, Newspaper, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { MEDAL } from '@/common/dailyMedal.constants'
import { dailyResults } from '@/common/fiveLetters/fiveLettersSaves.functions'
import { todayIso } from '@/common/date.functions'
import { formatDayMonth } from '@/common/format.functions'
import {
  dailyWord,
  dayNumber,
} from '@/common/fiveLetters/fiveLetters.functions'
import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import {
  dailyId,
  isDaily,
  isDaily2,
  daily2Id,
  slotOf,
} from '@/common/fiveLetters/fiveLettersSaves.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { replaceRoute } from '@/common/route.hooks'
import { FiveLettersIcon } from '@/components/FiveLettersIcon/FiveLettersIcon'
import { MenuSection } from '@/components/MenuSection/MenuSection'
import { MenuTile } from '@/components/MenuTile/MenuTile'
import { DAILY_RESULT_LABEL } from '@/views/FiveLettersHomeView/FiveLettersHomeView.constants'
import { HomeScreen } from '@/components/HomeScreen/HomeScreen'
import { gameDefinition } from '@/common/game.functions'

const DEFINITION = gameDefinition(GAME_ROUTE.FIVE_LETTERS)

export function FiveLettersHomeView({ play }: { play?: string }) {
  const { games, openGame, startAndOpen, startPractice, startDaily2 } =
    useFiveLettersGames()
  const [fetching, setFetching] = useState(false)
  const [daily2Unavailable, setDaily2Unavailable] = useState(false)
  const today = todayIso()
  const daily = games.findLast((game) => game.wordId === dailyId(today))
  const daily2 = games.findLast(
    (game) =>
      slotOf(game.wordId) === daily2Id(today) &&
      game.status !== GAME_STATUS.ABANDONED,
  )
  const practice = games.findLast(
    (game) =>
      !isDaily(game.wordId) &&
      !isDaily2(game.wordId) &&
      game.status === GAME_STATUS.IN_PROGRESS,
  )
  const dailyResult = daily ? DAILY_RESULT_LABEL[daily.status] : null
  const daily2Result = daily2 ? DAILY_RESULT_LABEL[daily2.status] : null

  async function openDaily2() {
    if (daily2) {
      openGame(daily2)
      return
    }
    setFetching(true)
    const started = await startDaily2(today)
    setFetching(false)
    setDaily2Unavailable(!started)
  }

  const playedRef = useRef(false)

  useEffect(() => {
    if (play === undefined || playedRef.current) return
    playedRef.current = true
    replaceRoute([GAME_ROUTE.FIVE_LETTERS])
    if (daily) {
      openGame(daily)
    } else {
      void loadWords().then((words) =>
        startAndOpen({
          id: dailyId(today),
          answer: dailyWord({ words, date: today }),
        }),
      )
    }
  }, [daily, openGame, play, startAndOpen, today])

  return (
    <HomeScreen
      definition={DEFINITION}
      title="Five Letters"
      icon={<FiveLettersIcon />}
      tagline="Guess the word in six tries, a new one every day"
      dailyResults={dailyResults(games)}
      dailyTotal={2}
      firstMedal={MEDAL.SILVER}

      className="min-h-dvh"
    >
      <MenuSection title="Today" aside={formatDayMonth(today)}>
        <MenuTile
          label={`Today's word · #${dayNumber(today)}`}
          icon={<CalendarCheck className="size-5" />}
          detail={dailyResult ?? undefined}
          done={daily?.status === GAME_STATUS.WON}
          active={daily?.status === GAME_STATUS.IN_PROGRESS}
          onClick={async () =>
            daily
              ? openGame(daily)
              : startAndOpen({
                  id: dailyId(today),
                  answer: dailyWord({ words: await loadWords(), date: today }),
                })
          }
        />
        <MenuTile
          label="Daily puzzle 2"
          icon={<Newspaper className="size-5" />}
          detail={daily2Result ?? undefined}
          done={daily2?.status === GAME_STATUS.WON}
          active={daily2?.status === GAME_STATUS.IN_PROGRESS}
          disabled={fetching}
          onClick={() => void openDaily2()}
        />
        {daily2Unavailable && (
          <p role="alert" className="px-1 text-sm text-destructive">
            Couldn't load Daily puzzle 2. Check your connection and try again.
          </p>
        )}
      </MenuSection>
      <MenuSection title="Practice">
        <div className="flex gap-2">
          <div className="flex-1">
            <MenuTile
              label={practice ? 'Continue practice' : 'Practice'}
              icon={<Dumbbell className="size-5" />}
              active={practice !== undefined}
              onClick={() => (practice ? openGame(practice) : startPractice())}
            />
          </div>
          {practice && (
            <div className="flex-1">
              <MenuTile
                label="New practice"
                icon={<RotateCcw className="size-5" />}
                onClick={startPractice}
              />
            </div>
          )}
        </div>
      </MenuSection>
      <p className="px-1 text-sm text-muted-foreground">
        Everyone with Puzzles gets the same word each day, so you can compare
        grids.
      </p>
    </HomeScreen>
  )
}
