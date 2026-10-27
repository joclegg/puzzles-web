import { useFiveLettersGames } from '@/common/fiveLetters/fiveLetters.hooks'
import { BarChart3, Settings } from 'lucide-react'
import { useState } from 'react'

import { todayIso } from '@/common/date.functions'
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
import { navigate } from '@/common/route.hooks'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { DAILY_RESULT_LABEL } from '@/views/FiveLettersHomeView/FiveLettersHomeView.constants'

export function FiveLettersHomeView() {
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

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-4 px-4 pb-8">
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
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        className="h-auto flex-col py-4 text-base"
        onClick={() =>
          daily
            ? openGame(daily)
            : startAndOpen({
                id: dailyId(today),
                answer: dailyWord({ words: WORDS, date: today }),
              })
        }
      >
        <span>Today's word · #{dayNumber(today)}</span>
        {dailyResult && (
          <span className="text-xs text-muted-foreground">{dailyResult}</span>
        )}
      </Button>
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        className="h-auto flex-col py-4 text-base"
        disabled={fetching}
        onClick={() => void openNyt()}
      >
        <span>NY Times daily</span>
        {nytResult && (
          <span className="text-xs text-muted-foreground">{nytResult}</span>
        )}
      </Button>
      {nytUnavailable && (
        <p role="alert" className="text-sm text-destructive">
          Couldn't reach the New York Times. Check your connection and try
          again.
        </p>
      )}
      <div className="flex gap-2">
        <Button
          variant={BUTTON_VARIANT.OUTLINE}
          className="h-12 flex-1"
          onClick={() => (practice ? openGame(practice) : startPractice())}
        >
          {practice ? 'Continue practice' : 'Practice'}
        </Button>
        {practice && (
          <Button
            variant={BUTTON_VARIANT.OUTLINE}
            className="h-12 flex-1"
            onClick={startPractice}
          >
            New practice
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Everyone with Puzzles gets the same word each day, so you can compare
        grids.
      </p>
    </main>
  )
}
