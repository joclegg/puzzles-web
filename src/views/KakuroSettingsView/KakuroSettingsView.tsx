import {
  INPUT_MODE,
  INPUT_MODE_LABEL,
  MISTAKE_CHECK,
  MISTAKE_CHECK_LABEL,
} from '@/common/kakuro/kakuro.constants'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/kakuro/kakuroSettings.constants'
import type { KakuroSettings } from '@/common/kakuro/kakuroSettings.types'
import { GAME_ROUTE } from '@/common/route.constants'
import { useStoredState } from '@/common/storage.hooks'
import { OptionGroup } from '@/components/OptionGroup/OptionGroup'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function KakuroSettingsView() {
  const [settings, setSettings] = useStoredState<KakuroSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  function set(patch: Partial<KakuroSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 pb-8">
      <ScreenHeader title="Settings" back={[GAME_ROUTE.KAKURO]} />
      <h2 className="pt-2 font-semibold">Entering numbers</h2>
      <OptionGroup
        label="Entering numbers"
        options={Object.values(INPUT_MODE)}
        value={settings.inputMode}
        labels={INPUT_MODE_LABEL}
        onChange={(inputMode) => set({ inputMode })}
      />
      <p className="text-sm text-muted-foreground">
        Cell first: tap a cell, then a number. Number first: pick a number, then
        tap cells to fill them.
      </p>
      <h2 className="pt-4 font-semibold">Mistakes</h2>
      <OptionGroup
        label="Mistakes"
        options={Object.values(MISTAKE_CHECK)}
        value={settings.mistakeCheck}
        labels={MISTAKE_CHECK_LABEL}
        onChange={(mistakeCheck) => set({ mistakeCheck })}
      />
      <p className="text-sm text-muted-foreground">
        Block clashes refuses a number already in the run. Show wrong turns any
        wrong number red. Both turn runs that can no longer add up red, and
        count mistakes.
      </p>
      <SettingRow
        label="Show the mistake counter"
        checked={settings.showMistakeCount}
        onChange={(showMistakeCount) => set({ showMistakeCount })}
      />
      <SettingRow
        label="Remove pencil marks automatically"
        detail="Placing a number clears that number's pencil marks from its across and down runs."
        checked={settings.autoRemoveNotes}
        onChange={(autoRemoveNotes) => set({ autoRemoveNotes })}
      />
      <SettingRow
        label="Highlight runs"
        detail="Shade the across and down runs of the selected cell."
        checked={settings.highlightRuns}
        onChange={(highlightRuns) => set({ highlightRuns })}
      />
      <SettingRow
        label="Show the timer"
        checked={settings.showTimer}
        onChange={(showTimer) => set({ showTimer })}
      />
      <SettingRow
        label="Sum helper"
        detail="List the digit combinations that still fit the selected cell's runs."
        checked={settings.showCombinations}
        onChange={(showCombinations) => set({ showCombinations })}
      />
    </main>
  )
}
