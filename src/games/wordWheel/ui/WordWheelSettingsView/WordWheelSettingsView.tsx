import { AssistSettings } from '@/shared/screens/AssistSettings/AssistSettings'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/games/wordWheel/engine/wordWheelSaves.constants'
import type { WordWheelSettings } from '@/games/wordWheel/engine/wordWheelSaves.types'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { SettingsScreen } from '@/shared/screens/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/shared/screens/SettingRow/SettingRow'

export function WordWheelSettingsView() {
  const [settings, setSettings] = useStoredState<WordWheelSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  return (
    <SettingsScreen game={GAME_ROUTE.WORD_WHEEL}>
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
