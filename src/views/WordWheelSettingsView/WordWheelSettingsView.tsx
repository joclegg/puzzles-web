import { GAME_ROUTE } from '@/common/route.constants'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/wordWheel/wordWheelSaves.constants'
import type { WordWheelSettings } from '@/common/wordWheel/wordWheelSaves.types'
import { useStoredState } from '@/common/storage.hooks'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function WordWheelSettingsView() {
  const [settings, setSettings] = useStoredState<WordWheelSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 pb-8">
      <ScreenHeader title="Settings" back={[GAME_ROUTE.WORD_WHEEL]} />
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
    </main>
  )
}
