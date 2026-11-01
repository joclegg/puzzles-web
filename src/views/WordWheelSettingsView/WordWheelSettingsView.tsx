import { AssistSettings } from '@/components/AssistSettings/AssistSettings'
import { GAME_ROUTE } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/wordWheel/wordWheelSaves.constants'
import type { WordWheelSettings } from '@/common/wordWheel/wordWheelSaves.types'
import { useStoredState } from '@/common/storage.hooks'
import { SettingsScreen } from '@/components/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function WordWheelSettingsView({ account }: { account: Account }) {
  const [settings, setSettings] = useStoredState<WordWheelSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  return (
    <SettingsScreen game={GAME_ROUTE.WORD_WHEEL} account={account}>
      <SettingRow
        label="Show the timer"
        checked={settings.showTimer}
        onChange={(showTimer) =>
          setSettings((current) => ({ ...current, showTimer }))
        }
      />
      <SettingRow
        label="Show the bonus word count"
        checked={settings.showBonusCount}
        onChange={(showBonusCount) =>
          setSettings((current) => ({ ...current, showBonusCount }))
        }
      />
      <AssistSettings
        assists={settings}
        onChange={(patch) =>
          setSettings((current) => ({ ...current, ...patch }))
        }
      />
    </SettingsScreen>
  )
}
