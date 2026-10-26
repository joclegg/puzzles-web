import { formatDuration } from '@/common/format.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { LEVEL_LETTERS } from '@/common/wordWheel/wordWheel.constants'
import { useWordWheelGames } from '@/common/wordWheel/wordWheel.hooks'
import { levelStats } from '@/common/wordWheel/wordWheelSaves.functions'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

export function WordWheelStatsView() {
  const { games } = useWordWheelGames()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-8">
      <ScreenHeader title="Stats" back={[GAME_ROUTE.WORD_WHEEL]} />
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
      <p className="text-sm text-muted-foreground">
        Solved out of played. Bonus counts every extra word you found.
      </p>
    </main>
  )
}
