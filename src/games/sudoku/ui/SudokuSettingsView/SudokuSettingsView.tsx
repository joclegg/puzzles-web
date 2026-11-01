import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { useStoredState } from '@/shared/storage/storage.hooks'
import {
  GAME_MODE,
  GAME_MODE_LABEL,
  GAME_MODES,
  HIGHLIGHT_STYLE,
  HIGHLIGHT_STYLE_LABEL,
  INPUT_MODE,
  INPUT_MODE_LABEL,
  MISTAKE_CHECK,
  MISTAKE_CHECK_LABEL,
} from '@/games/sudoku/engine/sudoku.constants'
import type { GameMode } from '@/games/sudoku/engine/sudoku.types'
import {
  DEFAULT_SETTINGS,
  DIGIT_COUNTS,
  DIGIT_COUNTS_LABEL,
  SETTINGS_KEY,
} from '@/games/sudoku/engine/sudokuSaves.constants'
import {
  fromStoredSettings,
  toStoredSettings,
} from '@/games/sudoku/engine/sudokuSaves.functions'
import type {
  ModeSettings,
  SudokuSettings,
} from '@/games/sudoku/engine/sudokuSaves.types'
import { AssistSettings } from '@/shared/screens/AssistSettings/AssistSettings'
import { OptionGroup } from '@/shared/ui/OptionGroup/OptionGroup'
import { SettingsScreen } from '@/shared/screens/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/shared/screens/SettingRow/SettingRow'

export function SudokuSettingsView() {
  const [stored, setStored] = useStoredState<SudokuSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })
  const settings = fromStoredSettings(stored)
  const [mode, setMode] = useStoredState<GameMode>({
    key: 'sudoku.settingsMode',
    fallback: GAME_MODE.CLASSIC,
  })
  const current = settings[mode]

  function setSettings(change: (all: SudokuSettings) => SudokuSettings) {
    setStored((all) => toStoredSettings(change(fromStoredSettings(all))))
  }

  function set(patch: Partial<ModeSettings>) {
    setSettings((all) => ({ ...all, [mode]: { ...all[mode], ...patch } }))
  }

  return (
    <SettingsScreen game={GAME_ROUTE.SUDOKU}>
      <h2 className="pt-2 font-semibold text-game">Entering numbers</h2>
      <OptionGroup
        label="Entering numbers"
        options={Object.values(INPUT_MODE)}
        value={settings.inputMode}
        labels={INPUT_MODE_LABEL}
        onChange={(inputMode) => setSettings((all) => ({ ...all, inputMode }))}
      />
      <p className="text-sm text-muted-foreground">
        {settings.inputMode === INPUT_MODE.CELL_FIRST
          ? "Tap a cell, then pick its number. Try number first: it's faster once you're used to it. Applies to both modes."
          : 'Pick a number, then tap every cell it goes in. Applies to both modes.'}
      </p>
      <OptionGroup
        label="Settings for"
        options={GAME_MODES}
        value={mode}
        labels={GAME_MODE_LABEL}
        onChange={(next) => setMode(() => next)}
      />
      <h2 className="pt-2 font-semibold text-game">Mistakes</h2>
      <OptionGroup
        label="Mistakes"
        options={Object.values(MISTAKE_CHECK)}
        value={current.mistakeCheck}
        labels={MISTAKE_CHECK_LABEL}
        onChange={(mistakeCheck) => set({ mistakeCheck })}
      />
      <p className="text-sm text-muted-foreground">
        Block clashes refuses a number already in the row, column, box or cage.
        Show wrong turns any wrong number red. Applies to new games.
      </p>
      <SettingRow
        label="Show mistake counter"
        checked={current.showMistakeCount}
        onChange={(showMistakeCount) => set({ showMistakeCount })}
      />
      <h2 className="pt-4 font-semibold text-game">Highlighting</h2>
      <SettingRow
        label="Row, column and box"
        detail="Around the selected cell"
        checked={current.highlightHouses}
        onChange={(highlightHouses) => set({ highlightHouses })}
      />
      {mode === GAME_MODE.KILLER && (
        <SettingRow
          label="Cage"
          detail="The selected cell's cage"
          checked={current.highlightCage}
          onChange={(highlightCage) => set({ highlightCage })}
        />
      )}
      <p className="pt-2 text-sm font-medium">Same number</p>
      <OptionGroup
        label="Same number"
        options={Object.values(HIGHLIGHT_STYLE)}
        value={current.sameNumberStyle}
        labels={HIGHLIGHT_STYLE_LABEL}
        onChange={(sameNumberStyle) => set({ sameNumberStyle })}
      />
      <p className="text-sm font-medium">Matching pencil marks</p>
      <OptionGroup
        label="Matching pencil marks"
        options={Object.values(HIGHLIGHT_STYLE)}
        value={current.notesStyle}
        labels={HIGHLIGHT_STYLE_LABEL}
        onChange={(notesStyle) => set({ notesStyle })}
      />
      <p className="text-sm text-muted-foreground">
        Cell shades the whole cell; number colours just the digit.
      </p>
      <SettingRow
        label="Highlight the cell you just filled"
        detail="Keep it and its row, column and box highlighted"
        checked={current.highlightLastPlaced}
        onChange={(highlightLastPlaced) => set({ highlightLastPlaced })}
      />
      <h2 className="pt-4 font-semibold text-game">Look</h2>
      <SettingRow
        label="Grey starting cells"
        checked={current.greyGivenCells}
        onChange={(greyGivenCells) => set({ greyGivenCells })}
      />
      <SettingRow
        label="Bold numbers you place"
        detail="Heavier than the starting numbers"
        checked={current.boldPlacedDigits}
        onChange={(boldPlacedDigits) => set({ boldPlacedDigits })}
      />
      <h2 className="pt-4 font-semibold text-game">Playing</h2>
      <SettingRow
        label="Clear pencil marks automatically"
        detail="When you place a number"
        checked={current.autoRemoveNotes}
        onChange={(autoRemoveNotes) => set({ autoRemoveNotes })}
      />
      <p className="pt-2 text-sm font-medium">Number counts</p>
      <OptionGroup
        label="Number counts"
        options={Object.values(DIGIT_COUNTS)}
        value={current.digitCounts}
        labels={DIGIT_COUNTS_LABEL}
        onChange={(digitCounts) => set({ digitCounts })}
      />
      <p className="text-sm text-muted-foreground">
        Count up shows how many of each number are placed; count down shows how
        many are left.
      </p>
      <SettingRow
        label="Disable finished numbers"
        detail="Once all are placed"
        checked={current.disableCompletedDigits}
        onChange={(disableCompletedDigits) => set({ disableCompletedDigits })}
      />
      <SettingRow
        label="Show timer"
        detail="Best times are still recorded"
        checked={current.showTimer}
        onChange={(showTimer) => set({ showTimer })}
      />
      <AssistSettings assists={current} hintStyles onChange={set} />
    </SettingsScreen>
  )
}
