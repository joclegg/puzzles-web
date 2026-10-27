import { formatDuration } from '@/common/format.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import {
  DIFFICULTY_LABEL,
  GAME_MODE_LABEL,
  GAME_MODES,
} from '@/common/sudoku/sudoku.constants'
import { useSudokuGames } from '@/common/sudoku/sudoku.hooks'
import { bestTimes } from '@/common/sudoku/sudokuSaves.functions'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SudokuStatsView() {
  const { games } = useSudokuGames()
  const times = bestTimes(games)

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="Best times" back={[GAME_ROUTE.SUDOKU]} />
      {GAME_MODES.map((mode) => (
        <section key={mode} aria-label={GAME_MODE_LABEL[mode]}>
          <h2 className="pb-1 font-semibold">{GAME_MODE_LABEL[mode]}</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-1 font-medium">Level</th>
                <th className="py-1 font-medium">Solved</th>
                <th className="py-1 font-medium">Best</th>
                <th className="py-1 font-medium">Average</th>
              </tr>
            </thead>
            <tbody>
              {times
                .filter((row) => row.mode === mode)
                .map((row) => (
                  <tr key={row.difficulty} className="border-t">
                    <th scope="row" className="py-1 text-left font-medium">
                      {DIFFICULTY_LABEL[row.difficulty]}
                    </th>
                    <td className="py-1">{row.completed}</td>
                    <td className="py-1">
                      {row.bestMs === null ? '–' : formatDuration(row.bestMs)}
                    </td>
                    <td className="py-1">
                      {row.averageMs === null
                        ? '–'
                        : formatDuration(row.averageMs)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      ))}
      <p className="text-sm text-muted-foreground">
        Custom puzzles show in History but don't count towards best times.
      </p>
    </main>
  )
}
