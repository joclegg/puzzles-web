import { formatDuration } from '@/common/format.functions'
import type { SizeStats } from '@/common/puzzleSaves.types'

export function SizeStatsTable({
  stats,
  label,
}: {
  stats: SizeStats[]
  label: (size: number) => string
}) {
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-muted-foreground">
        <tr>
          <th className="py-2 font-medium">Size</th>
          <th className="py-2 font-medium">Played</th>
          <th className="py-2 font-medium">Solved</th>
          <th className="py-2 font-medium">Best</th>
          <th className="py-2 font-medium">Average</th>
        </tr>
      </thead>
      <tbody>
        {stats.map((row) => (
          <tr key={row.size} className="border-t">
            <th scope="row" className="py-2 text-left font-medium">
              {label(row.size)}
            </th>
            <td className="py-2">{row.played}</td>
            <td className="py-2">{row.solved}</td>
            <td className="py-2">
              {row.bestMs === null ? '–' : formatDuration(row.bestMs)}
            </td>
            <td className="py-2">
              {row.averageMs === null ? '–' : formatDuration(row.averageMs)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
