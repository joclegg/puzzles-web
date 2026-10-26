import { cn } from '@/common/utils.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import { useStoredState } from '@/common/storage.hooks'
import {
  DEFAULT_SETTINGS,
  INPUT_MODE,
  SETTINGS_KEY,
} from '@/common/twoTone/twoToneSettings.constants'
import type { TwoToneSettings } from '@/common/twoTone/twoToneSettings.types'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SettingRow } from '@/components/SettingRow/SettingRow'
import { INPUT_MODE_LABEL } from '@/views/TwoToneSettingsView/TwoToneSettingsView.constants'

export function TwoToneSettingsView() {
  const [settings, setSettings] = useStoredState<TwoToneSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  function set(patch: Partial<TwoToneSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 pb-8">
      <ScreenHeader title="Settings" back={[GAME_ROUTE.TWO_TONE]} />
      <h2 className="pt-2 font-semibold">Filling in</h2>
      <div
        className="flex gap-2 py-3"
        role="radiogroup"
        aria-label="Filling in"
      >
        {Object.values(INPUT_MODE).map((mode) => (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={settings.inputMode === mode}
            onClick={() => set({ inputMode: mode })}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-sm ring-1 ring-border',
              settings.inputMode === mode &&
                'bg-primary text-primary-foreground',
            )}
          >
            {INPUT_MODE_LABEL[mode]}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Tap to cycle steps a spot through the colours. Pick a colour shows
        colour buttons under the board: pick one, then tap spots to fill them.
      </p>
      <SettingRow
        label="Mark broken rules"
        detail="Outline tiles that make three in a row, overfill a line or copy another line."
        checked={settings.markBrokenRules}
        onChange={(markBrokenRules) => set({ markBrokenRules })}
      />
      <SettingRow
        label="Show the timer"
        checked={settings.showTimer}
        onChange={(showTimer) => set({ showTimer })}
      />
      <SettingRow
        label="Show how much is filled in"
        checked={settings.showProgress}
        onChange={(showProgress) => set({ showProgress })}
      />
    </main>
  )
}
