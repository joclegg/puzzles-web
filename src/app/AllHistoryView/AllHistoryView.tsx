import { formatDateTime, formatDuration } from '@/shared/lib/format.functions'
import { historyRows } from '@/shared/game/AllGames/AllGames.functions'
import { useAllSaves } from '@/shared/game/AllGames/AllGames.hooks'
import { EmptyState } from '@/shared/screens/EmptyState/EmptyState'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function AllHistoryView() {
  const rows = historyRows(useAllSaves())

  return (
    <MenuScreen accent={MENU_ACCENT.SUDOKU}>
      <ScreenHeader title="History" back={[]} />
      {rows.length === 0 ? (
        <EmptyState message="No games yet." />
      ) : (
        <ul className="flex flex-col divide-y rounded-2xl bg-card px-4 ring-1 ring-border">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center gap-2 py-3">
              <span className="flex-1">
                <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {row.game}
                </span>
                <span className="block font-medium">{row.title}</span>
                <span className="block text-sm text-muted-foreground">
                  {row.detail}
                </span>
              </span>
              <span className="text-right text-sm">
                {row.elapsedMs !== null && (
                  <span className="block">{formatDuration(row.elapsedMs)}</span>
                )}
                <span className="block text-muted-foreground">
                  {formatDateTime(row.startedAt)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </MenuScreen>
  )
}
