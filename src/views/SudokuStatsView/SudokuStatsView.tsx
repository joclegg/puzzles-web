import { formatDuration } from '@/common/format.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import {
  DIFFICULTY_LABEL,
  GAME_MODE_LABEL,
  GAME_MODES,
} from '@/common/sudoku/sudoku.constants'
import { useStoredState } from '@/common/storage.hooks'
import { useSudokuGames } from '@/common/sudoku/sudoku.hooks'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/sudoku/sudokuSaves.constants'
import { bestTimes } from '@/common/sudoku/sudokuSaves.functions'
import type { SudokuSettings } from '@/common/sudoku/sudokuSaves.types'
import { MenuScreen } from '@/components/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { Panel } from '@/components/Panel/Panel'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'

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
