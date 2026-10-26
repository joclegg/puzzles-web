import { GAMES_KEY } from '@/common/fiveLetters/fiveLettersSaves.constants'
import { statsOf } from '@/common/fiveLetters/fiveLettersSaves.functions'
import type { SavedGame } from '@/common/fiveLetters/fiveLettersSaves.types'
import { GAME_ROUTE } from '@/common/route.constants'
import { useStoredState } from '@/common/storage.hooks'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { StatFigure } from '@/components/StatFigure/StatFigure'
import { BAR_WIDTH_CLASS } from '@/views/FiveLettersStatsView/FiveLettersStatsView.constants'
import { cn } from '@/common/utils.functions'

export function FiveLettersStatsView() {
  const [games] = useStoredState<SavedGame[]>({ key: GAMES_KEY, fallback: [] })
  const stats = statsOf(games)
  const most = Math.max(1, ...stats.guessCounts)
  const winPercent =
    stats.played === 0 ? 0 : Math.floor((stats.won * 100) / stats.played)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="Stats" back={[GAME_ROUTE.FIVE_LETTERS]} />
      <div className="flex">
        <StatFigure value={stats.played} label="Played" />
        <StatFigure value={winPercent} label="Win %" />
        <StatFigure value={stats.currentStreak} label="Streak" />
        <StatFigure value={stats.maxStreak} label="Best streak" />
      </div>
      <h2 className="font-semibold">Guesses</h2>
      <ol className="flex flex-col gap-1">
        {stats.guessCounts.map((count, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-4 text-sm">{index + 1}</span>
            <span
              aria-label={`${index + 1} guesses`}
              className={cn(
                'flex justify-end bg-fl-correct px-2 text-sm text-white',
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
    </main>
  )
}
