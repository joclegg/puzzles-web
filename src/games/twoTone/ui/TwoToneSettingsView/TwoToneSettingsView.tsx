import { AssistSettings } from '@/shared/screens/AssistSettings/AssistSettings'
import { cn } from '@/shared/lib/utils.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { useStoredState } from '@/shared/storage/storage.hooks'
import {
  DEFAULT_SETTINGS,
  INPUT_MODE,
  SETTINGS_KEY,
} from '@/games/twoTone/engine/twoToneSettings.constants'
import type { TwoToneSettings } from '@/games/twoTone/engine/twoToneSettings.types'
import { SettingsScreen } from '@/shared/screens/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/shared/screens/SettingRow/SettingRow'
import { INPUT_MODE_LABEL } from '@/games/twoTone/ui/TwoToneSettingsView/TwoToneSettingsView.constants'

export function TwoToneSettingsView() {
  const [settings, setSettings] = useStoredState<TwoToneSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  function set(patch: Partial<TwoToneSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <SettingsScreen game={GAME_ROUTE.TWO_TONE}>
      <h2 className="pt-2 font-semibold text-game">Filling in</h2>
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
              settings.inputMode === mode && 'bg-game text-background',
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
      <AssistSettings assists={settings} onChange={set} />
    </SettingsScreen>
  )
}
