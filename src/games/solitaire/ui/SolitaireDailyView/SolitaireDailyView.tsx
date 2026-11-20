import { DEFINITION } from '@/games/solitaire/definition'
import { solitaireDailiesShare } from '@/games/solitaire/engine/solitaireShare.functions'
import { todayIso } from '@/shared/lib/date.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { useSolitaireGames } from '@/games/solitaire/engine/solitaire.hooks'
import {
  DAILY_PREFIX,
  DEAL_STATUS,
} from '@/games/solitaire/engine/solitaireSaves.constants'
import { dailyResults } from '@/games/solitaire/engine/solitaireSaves.functions'
import { DailyCalendar } from '@/shared/screens/DailyCalendar/DailyCalendar'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'

export function SolitaireDailyView() {
  const { games, openDaily } = useSolitaireGames()
  const results = dailyResults(games)
  return (
    <DailyCalendar
      accent={MENU_ACCENT.SOLITAIRE}
      route={GAME_ROUTE.SOLITAIRE}
      results={results}
      total={1}
      share={solitaireDailiesShare({
        name: DEFINITION.name,
        games,
        date: todayIso(),
        dayOf: (ms) => todayIso(new Date(ms)),
      })}
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
