import { AssistSettings } from '@/components/AssistSettings/AssistSettings'
import { cn } from '@/common/utils.functions'
import { GAME_ROUTE } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { useStoredState } from '@/common/storage.hooks'
import {
  DEFAULT_SETTINGS,
  INPUT_MODE,
  SETTINGS_KEY,
} from '@/common/sightlines/sightlinesSettings.constants'
import type { SightlinesSettings } from '@/common/sightlines/sightlinesSettings.types'
import { SettingsScreen } from '@/components/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/components/SettingRow/SettingRow'
import { INPUT_MODE_LABEL } from '@/views/SightlinesSettingsView/SightlinesSettingsView.constants'

export function SightlinesSettingsView({ account }: { account: Account }) {
  const [settings, setSettings] = useStoredState<SightlinesSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  function set(patch: Partial<SightlinesSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <SettingsScreen game={GAME_ROUTE.SIGHTLINES} account={account}>
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
        detail="Outline numbers that see too many or can no longer see enough, and blue dots that can see nothing."
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
      <SettingRow
        label="Show what numbers see now"
        detail="A small count on each number of the blue dots it can see so far."
        checked={settings.showSeen}
        onChange={(showSeen) => set({ showSeen })}
      />
      <AssistSettings assists={settings} onChange={set} />
    </SettingsScreen>
  )
}
