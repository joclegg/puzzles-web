import type { GameDefinition, PuzzleOptions } from '@/shared/game/game.types'
import { dailyPuzzleResults } from '@/shared/game/puzzleSaves.functions'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { puzzleDailiesShare } from '@/shared/game/share.functions'
import { todayIso } from '@/shared/lib/date.functions'
import { DailyCalendar } from '@/shared/screens/DailyCalendar/DailyCalendar'

export function PuzzleDailyView<T extends number | string>({
  definition,
  games,
  options,
  onPlay,
  moves = false,
}: {
  definition: GameDefinition
  games: SavedPuzzle[]
  options: PuzzleOptions<T>
  onPlay: (choice: { date: string; value: T }) => void
  moves?: boolean
}) {
  const results = dailyPuzzleResults(games)
  const solved = new Set(results.map((result) => result.id))
  return (
    <DailyCalendar
      accent={definition.accent}
      route={definition.id}
      results={results}
      total={options.values.length}
      share={puzzleDailiesShare({
        name: definition.name,
        games,
        options,
        date: todayIso(),
        moves,
        dayOf: (ms) => todayIso(new Date(ms)),
      })}
      choices={(date) =>
        options.values.map((value) => ({
          label: options.label(value),
          done: solved.has(options.dailyId({ date, value })),
          onPlay: () => onPlay({ date, value }),
        }))
      }
    />
  )
}
