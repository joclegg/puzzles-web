import { GAME_ROUTE } from '@/common/route.constants'
import { useSolitaireGames } from '@/common/solitaire/solitaire.hooks'
import {
  DAILY_PREFIX,
  DEAL_STATUS,
} from '@/common/solitaire/solitaireSaves.constants'
import { dailyResults } from '@/common/solitaire/solitaireSaves.functions'
import { DailyCalendar } from '@/components/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'

export function SolitaireDailyView() {
  const { games, openDaily } = useSolitaireGames()
  const results = dailyResults(games)
  return (
    <DailyCalendar
      accent={MENU_ACCENT.SOLITAIRE}
      route={GAME_ROUTE.SOLITAIRE}
      results={results}
      total={1}
      choices={(date) => [
        {
          label: 'Daily deal',
          done: games.some(
            (game) =>
              game.dealId === `${DAILY_PREFIX}${date}` &&
              game.status === DEAL_STATUS.WON,
          ),
          onPlay: () => void openDaily(date),
        },
      ]}
    />
  )
}
