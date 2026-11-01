import { AssistSettings } from '@/shared/screens/AssistSettings/AssistSettings'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/games/slideOut/engine/slideOutSaves.constants'
import type { SlideOutSettings } from '@/games/slideOut/engine/slideOutSaves.types'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { SettingsScreen } from '@/shared/screens/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/shared/screens/SettingRow/SettingRow'

export function SlideOutSettingsView() {
  const [settings, setSettings] = useStoredState<SlideOutSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  return (
    <SettingsScreen game={GAME_ROUTE.SLIDE_OUT}>
      <SettingRow
        label="Show the timer"
        checked={settings.showTimer}
        onChange={(showTimer) =>
          setSettings((current) => ({ ...current, showTimer }))
        }
      />
      <SettingRow
        label="Show par"
        detail="The fewest moves the puzzle can be solved in."
        checked={settings.showPar}
        onChange={(showPar) =>
          setSettings((current) => ({ ...current, showPar }))
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
