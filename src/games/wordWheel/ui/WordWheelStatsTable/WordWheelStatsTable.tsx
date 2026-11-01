import { formatDuration } from '@/shared/lib/format.functions'
import { LEVEL_LETTERS } from '@/games/wordWheel/engine/wordWheel.constants'
import { levelStats } from '@/games/wordWheel/engine/wordWheelSaves.functions'
import { Panel } from '@/shared/screens/Panel/Panel'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'

export function WordWheelStatsTable({ games }: { games: SavedPuzzle[] }) {
  return (
    <>
      <Panel>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 font-medium">Letters</th>
              <th className="py-2 font-medium">Solved</th>
              <th className="py-2 font-medium">Bonus</th>
              <th className="py-2 font-medium">Best</th>
            </tr>
          </thead>
          <tbody>
            {levelStats(games).map((row) => (
              <tr key={row.level} className="border-t">
                <th scope="row" className="py-2 text-left font-medium">
                  {LEVEL_LETTERS[row.level]}
                </th>
                <td className="py-2">
                  {row.solved}/{row.played}
                </td>
                <td className="py-2">{row.bonusWords}</td>
                <td className="py-2">
                  {row.bestMs === null ? '–' : formatDuration(row.bestMs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <p className="text-sm text-muted-foreground">
        Solved out of played. Bonus counts every extra word you found.
      </p>
    </>
  )
}
