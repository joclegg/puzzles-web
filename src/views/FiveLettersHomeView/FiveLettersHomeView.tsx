import { useFiveLettersGames } from '@/common/fiveLetters/fiveLetters.hooks'
import {
  BarChart3,
  CalendarCheck,
  Dumbbell,
  Newspaper,
  RotateCcw,
  Settings,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
  isNyt,
  nytId,
} from '@/common/fiveLetters/fiveLettersSaves.functions'
import { WORDS } from '@/common/fiveLetters/fiveLettersWords.constants'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate, replaceRoute } from '@/common/route.hooks'
import { Button } from '@/components/Button/Button'
import { BUTTON_SIZE } from '@/components/Button/Button.constants'
import { FiveLettersIcon } from '@/components/FiveLettersIcon/FiveLettersIcon'
import { GameHero } from '@/components/GameHero/GameHero'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { MenuSection } from '@/components/MenuSection/MenuSection'
import { MenuTile } from '@/components/MenuTile/MenuTile'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { DAILY_RESULT_LABEL } from '@/views/FiveLettersHomeView/FiveLettersHomeView.constants'

export function FiveLettersHomeView({ play }: { play?: string }) {
  const { games, openGame, startAndOpen, startPractice, startNytDaily } =
    useFiveLettersGames()
  const [fetching, setFetching] = useState(false)
  const [nytUnavailable, setNytUnavailable] = useState(false)
  const today = todayIso()
  const daily = games.findLast((game) => game.wordId === dailyId(today))
  const nyt = games.findLast(
    (game) =>
      game.wordId === nytId(today) && game.status !== GAME_STATUS.ABANDONED,
  )
  const practice = games.findLast(
    (game) =>
      !isDaily(game.wordId) &&
      !isNyt(game.wordId) &&
      game.status === GAME_STATUS.IN_PROGRESS,
  )
  const dailyResult = daily ? DAILY_RESULT_LABEL[daily.status] : null
  const nytResult = nyt ? DAILY_RESULT_LABEL[nyt.status] : null

  async function openNyt() {
    if (nyt) {
      openGame(nyt)
      return
    }
    setFetching(true)
    const started = await startNytDaily(today)
    setFetching(false)
    setNytUnavailable(!started)
  }

  const playedRef = useRef(false)

  useEffect(() => {
    if (play === undefined || playedRef.current) return
    playedRef.current = true
    replaceRoute([GAME_ROUTE.FIVE_LETTERS])
    if (daily) {
      openGame(daily)
    } else {
      startAndOpen({
        id: dailyId(today),
        answer: dailyWord({ words: WORDS, date: today }),
      })
    }
  }, [daily, openGame, play, startAndOpen, today])

  return (
    <MenuScreen accent={MENU_ACCENT.FIVE_LETTERS} className="min-h-dvh">
      <ScreenHeader title="Five Letters" back={[]}>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Stats"
          onClick={() => navigate([GAME_ROUTE.FIVE_LETTERS, SCREEN.STATS])}
        >
          <BarChart3 className="size-5" />
        </Button>
        <Button
          size={BUTTON_SIZE.ICON}
          aria-label="Settings"
          onClick={() => navigate([GAME_ROUTE.FIVE_LETTERS, SCREEN.SETTINGS])}
        >
          <Settings className="size-5" />
        </Button>
      </ScreenHeader>
      <GameHero
        icon={<FiveLettersIcon />}
        tagline="Guess the word in six tries, a new one every day"
      />
      <MenuSection title="Today" aside={formatDayMonth(today)}>
        <MenuTile
          label={`Today's word · #${dayNumber(today)}`}
          icon={<CalendarCheck className="size-5" />}
          detail={dailyResult ?? undefined}
          done={daily?.status === GAME_STATUS.WON}
          active={daily?.status === GAME_STATUS.IN_PROGRESS}
          onClick={() =>
            daily
              ? openGame(daily)
              : startAndOpen({
                  id: dailyId(today),
                  answer: dailyWord({ words: WORDS, date: today }),
                })
          }
        />
        <MenuTile
          label="NY Times daily"
          icon={<Newspaper className="size-5" />}
          detail={nytResult ?? undefined}
          done={nyt?.status === GAME_STATUS.WON}
          active={nyt?.status === GAME_STATUS.IN_PROGRESS}
          disabled={fetching}
          onClick={() => void openNyt()}
        />
        {nytUnavailable && (
          <p role="alert" className="px-1 text-sm text-destructive">
            Couldn't reach the New York Times. Check your connection and try
            again.
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
    </MenuScreen>
  )
}
