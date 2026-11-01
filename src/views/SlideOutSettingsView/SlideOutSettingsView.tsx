import { AssistSettings } from '@/components/AssistSettings/AssistSettings'
import { GAME_ROUTE } from '@/common/route.constants'
import type { Account } from '@/common/sync.types'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/slideOut/slideOutSaves.constants'
import type { SlideOutSettings } from '@/common/slideOut/slideOutSaves.types'
import { useStoredState } from '@/common/storage.hooks'
import { SettingsScreen } from '@/components/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function SlideOutSettingsView({ account }: { account: Account }) {
  const [settings, setSettings] = useStoredState<SlideOutSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  return (
    <SettingsScreen game={GAME_ROUTE.SLIDE_OUT} account={account}>
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
