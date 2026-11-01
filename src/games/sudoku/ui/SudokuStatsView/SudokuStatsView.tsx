import { formatDuration } from '@/shared/lib/format.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  DIFFICULTY_LABEL,
  GAME_MODE_LABEL,
  GAME_MODES,
} from '@/games/sudoku/engine/sudoku.constants'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { useSudokuGames } from '@/games/sudoku/engine/sudoku.hooks'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/games/sudoku/engine/sudokuSaves.constants'
import { bestTimes } from '@/games/sudoku/engine/sudokuSaves.functions'
import type { SudokuSettings } from '@/games/sudoku/engine/sudokuSaves.types'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Panel } from '@/shared/screens/Panel/Panel'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function SudokuStatsView() {
  const { games } = useSudokuGames()
  const [settings] = useStoredState<SudokuSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const times = bestTimes({ games, pastBests: settings.pastBests })

  return (
    <MenuScreen accent={MENU_ACCENT.SUDOKU}>
      <ScreenHeader title="Best times" back={[GAME_ROUTE.SUDOKU]} />
      {GAME_MODES.map((mode) => (
        <Panel key={mode} title={GAME_MODE_LABEL[mode]}>
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
        </Panel>
      ))}
      <p className="text-sm text-muted-foreground">
        Custom puzzles show in History but don't count towards best times.
      </p>
    </MenuScreen>
  )
}
