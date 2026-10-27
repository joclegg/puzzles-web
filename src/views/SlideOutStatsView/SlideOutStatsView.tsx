import { formatDuration } from '@/common/format.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { LEVEL_LABEL } from '@/common/slideOut/slideOut.constants'
import { useSlideOutGames } from '@/common/slideOut/slideOut.hooks'
import { levelStats } from '@/common/slideOut/slideOutSaves.functions'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function SlideOutStatsView() {
  const { games } = useSlideOutGames()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="Stats" back={[GAME_ROUTE.SLIDE_OUT]} />
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
      <p className="text-sm text-muted-foreground">
        Solved out of played. At par means solved in the fewest possible moves.
      </p>
    </main>
  )
}
