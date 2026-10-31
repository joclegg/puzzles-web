import { dailyWord } from '@/common/fiveLetters/fiveLetters.functions'
import { MEDAL } from '@/common/dailyMedal.constants'
import {
  loadWords,
  useFiveLettersGames,
} from '@/common/fiveLetters/fiveLetters.hooks'
import { GAME_STATUS } from '@/common/fiveLetters/fiveLettersSaves.constants'
import {
  dailyId,
  dailyResults,
  nytId,
} from '@/common/fiveLetters/fiveLettersSaves.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { DailyCalendar } from '@/components/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export function FiveLettersDailyView() {
  const { games, openGame, startAndOpen, startNytDaily } = useFiveLettersGames()
  const results = dailyResults(games)
  const won = new Set(results.map((result) => result.id))

  function existing(wordId: string) {
    return games.findLast(
      (game) => game.wordId === wordId && game.status !== GAME_STATUS.ABANDONED,
    )
  }

  async function playDaily(date: string) {
    const game = existing(dailyId(date))
    if (game) {
      openGame(game)
      return
    }
    startAndOpen({
      id: dailyId(date),
      answer: dailyWord({ words: await loadWords(), date }),
    })
  }

  return (
    <DailyCalendar
      accent={MENU_ACCENT.FIVE_LETTERS}
      route={GAME_ROUTE.FIVE_LETTERS}
      results={results}
      total={2}
      firstMedal={MEDAL.SILVER}
      choices={(date) => [
        {
          label: 'Puzzles daily',
          done: won.has(dailyId(date)),
          onPlay: () => void playDaily(date),
        },
        {
          label: 'NY Times daily',
          done: won.has(nytId(date)),
          onPlay: () => {
            const game = existing(nytId(date))
            if (game) {
              openGame(game)
            } else {
              void startNytDaily(date)
            }
          },
        },
      ]}
    />
  )
}
