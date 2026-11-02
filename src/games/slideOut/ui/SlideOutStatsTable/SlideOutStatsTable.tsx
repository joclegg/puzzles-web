import { formatDuration } from '@/shared/lib/format.functions'
import { LEVEL_LABEL } from '@/games/slideOut/engine/slideOut.constants'
import { levelStats } from '@/games/slideOut/engine/slideOutSaves.functions'
import { Panel } from '@/shared/screens/Panel/Panel'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'

export function SlideOutStatsTable({ games }: { games: SavedPuzzle[] }) {
  return (
    <>
      <Panel>
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 font-medium">Level</th>
              <th className="py-2 font-medium">Solved</th>
              <th className="py-2 font-medium">At par</th>
              <th className="py-2 font-medium">Best</th>
            </tr>
          </thead>
          <tbody>
            {levelStats(games).map((row) => (
              <tr key={row.level} className="border-t">
                <th scope="row" className="py-2 text-left font-medium">
                  {LEVEL_LABEL[row.level]}
                </th>
                <td className="py-2">
                  {row.solved}/{row.played}
                </td>
                <td className="py-2">{row.atPar}</td>
                <td className="py-2">
                  {row.bestMs === null ? '–' : formatDuration(row.bestMs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <p className="text-sm text-muted-foreground">
        Solved out of played. At par means solved in the fewest possible moves.
      </p>
    </>
  )
}
