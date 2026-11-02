import { GAMES_KEY } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import { statsOf } from '@/games/fiveLetters/engine/fiveLettersSaves.functions'
import type { SavedGame } from '@/games/fiveLetters/engine/fiveLettersSaves.types'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Panel } from '@/shared/screens/Panel/Panel'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'
import { StatFigure } from '@/shared/screens/StatFigure/StatFigure'
import { BAR_WIDTH_CLASS } from '@/games/fiveLetters/ui/FiveLettersStatsView/FiveLettersStatsView.constants'
import { cn } from '@/shared/lib/utils.functions'

export function FiveLettersStatsView() {
  const [games] = useStoredState<SavedGame[]>({ key: GAMES_KEY, fallback: [] })
  const stats = statsOf(games)
  const most = Math.max(1, ...stats.guessCounts)
  const winPercent =
    stats.played === 0 ? 0 : Math.floor((stats.won * 100) / stats.played)

  return (
    <MenuScreen accent={MENU_ACCENT.FIVE_LETTERS}>
      <ScreenHeader title="Stats" back={[GAME_ROUTE.FIVE_LETTERS]} />
      <Panel>
        <div className="flex py-2">
          <StatFigure value={stats.played} label="Played" />
          <StatFigure value={winPercent} label="Win %" />
          <StatFigure value={stats.currentStreak} label="Streak" />
          <StatFigure value={stats.maxStreak} label="Best streak" />
        </div>
      </Panel>
      <Panel title="Guesses">
        <ol className="flex flex-col gap-1 pb-1">
          {stats.guessCounts.map((count, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="w-4 text-sm">{index + 1}</span>
              <span
                aria-label={`${index + 1} guesses`}
                className={cn(
                  'flex justify-end rounded-sm bg-fl-correct px-2 text-sm text-white',
                  BAR_WIDTH_CLASS[
                    Math.round((count / most) * (BAR_WIDTH_CLASS.length - 1))
                  ],
                )}
              >
                {count}
              </span>
            </li>
          ))}
        </ol>
      </Panel>
    </MenuScreen>
  )
}
