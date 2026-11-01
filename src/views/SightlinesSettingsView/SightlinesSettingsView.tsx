import { AssistSettings } from '@/components/AssistSettings/AssistSettings'
import { GAME_ROUTE } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { useStoredState } from '@/common/storage.hooks'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/sightlines/sightlinesSettings.constants'
import type { SightlinesSettings } from '@/common/sightlines/sightlinesSettings.types'
import { SettingsScreen } from '@/components/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/components/SettingRow/SettingRow'

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
