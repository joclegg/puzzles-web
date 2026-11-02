import type { GameDefinition, PuzzleOptions } from '@/shared/game/game.types'
import { dailyPuzzleResults } from '@/shared/game/puzzleSaves.functions'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'
import { DailyCalendar } from '@/shared/screens/DailyCalendar/DailyCalendar'

export function PuzzleDailyView<T extends number | string>({
  definition,
  games,
  options,
  onPlay,
}: {
  definition: GameDefinition
  games: SavedPuzzle[]
  options: PuzzleOptions<T>
  onPlay: (choice: { date: string; value: T }) => void
}) {
  const results = dailyPuzzleResults(games)
  const solved = new Set(results.map((result) => result.id))
  return (
    <DailyCalendar
      accent={definition.accent}
      route={definition.id}
      results={results}
      total={options.values.length}
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
