import { AssistSettings } from '@/components/AssistSettings/AssistSettings'
import { GAME_ROUTE } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import { useStoredState } from '@/common/storage.hooks'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/twoTone/twoToneSettings.constants'
import type { TwoToneSettings } from '@/common/twoTone/twoToneSettings.types'
import { SettingsScreen } from '@/components/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function TwoToneSettingsView({ account }: { account: Account }) {
  const [settings, setSettings] = useStoredState<TwoToneSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  function set(patch: Partial<TwoToneSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <SettingsScreen game={GAME_ROUTE.TWO_TONE} account={account}>
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
