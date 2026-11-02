import { DEFINITION } from '@/games/fiveLetters/definition'
import { PuzzleStatsView } from '@/shared/screens/PuzzleStatsView/PuzzleStatsView'
import { GAMES_KEY } from '@/games/fiveLetters/engine/fiveLettersSaves.constants'
import { statsOf } from '@/games/fiveLetters/engine/fiveLettersSaves.functions'
import type { SavedGame } from '@/games/fiveLetters/engine/fiveLettersSaves.types'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { Panel } from '@/shared/screens/Panel/Panel'
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
    <PuzzleStatsView definition={DEFINITION}>
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
    </PuzzleStatsView>
  )
}
