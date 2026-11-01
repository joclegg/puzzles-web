import { EmptyState } from '@/shared/screens/EmptyState/EmptyState'
import { formatDateTime, formatDuration } from '@/shared/lib/format.functions'
import { PUZZLE_STATUS_LABEL } from '@/shared/game/puzzleSaves.constants'
import type { SavedPuzzle } from '@/shared/game/puzzleSaves.types'

export function PuzzleHistoryList({
  games,
  title,
}: {
  games: SavedPuzzle[]
  title: (game: SavedPuzzle) => string
}) {
  if (games.length === 0) {
    return <EmptyState message="No games yet." />
  }
  return (
    <ul className="flex flex-col divide-y rounded-2xl bg-card px-4 ring-1 ring-border">
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
