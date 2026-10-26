import { formatDateTime, formatDuration } from '@/common/format.functions'
import { PUZZLE_STATUS_LABEL } from '@/common/puzzleSaves.constants'
import type { SavedPuzzle } from '@/common/puzzleSaves.types'

export function PuzzleHistoryList({
  games,
  title,
}: {
  games: SavedPuzzle[]
  title: (game: SavedPuzzle) => string
}) {
  if (games.length === 0) {
    return <p className="text-muted-foreground">No games yet.</p>
  }
  return (
    <ul className="flex flex-col divide-y">
      {games.map((game) => (
        <li key={game.id} className="flex items-center gap-2 py-3">
          <span className="flex-1">
            <span className="block font-medium">{title(game)}</span>
            <span className="block text-sm text-muted-foreground">
              {PUZZLE_STATUS_LABEL[game.status]} · {game.hints} hints
            </span>
          </span>
          <span className="text-right text-sm">
            <span className="block">{formatDuration(game.elapsedMs)}</span>
            <span className="block text-muted-foreground">
              {formatDateTime(game.startedAt)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
