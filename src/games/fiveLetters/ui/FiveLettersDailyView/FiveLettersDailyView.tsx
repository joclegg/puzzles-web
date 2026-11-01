import { dailyWord } from '@/games/fiveLetters/engine/fiveLetters.functions'
import { MEDAL } from '@/shared/game/dailyMedal.constants'
import {
  loadWords,
  useFiveLettersGames,
} from '@/games/fiveLetters/engine/fiveLetters.hooks'
import { GAME_STATUS } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import {
  dailyId,
  dailyResults,
  daily2Id,
  slotOf,
} from '@/games/fiveLetters/engine/fiveLettersSaves.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { DailyCalendar } from '@/shared/screens/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export function FiveLettersDailyView() {
  const { games, openGame, startAndOpen, startDaily2 } = useFiveLettersGames()
  const results = dailyResults(games)
  const won = new Set(results.map((result) => result.id))

  function existing(wordId: string) {
    return games.findLast(
      (game) =>
        slotOf(game.wordId) === wordId && game.status !== GAME_STATUS.ABANDONED,
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
          label: 'Daily puzzle 2',
          done: won.has(daily2Id(date)),
          onPlay: () => {
            const game = existing(daily2Id(date))
            if (game) {
              openGame(game)
            } else {
              void startDaily2(date)
            }
          },
        },
      ]}
    />
  )
}
