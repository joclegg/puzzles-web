import { GAME_ROUTE } from '@/common/route.constants'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/slideOut/slideOutSaves.constants'
import type { SlideOutSettings } from '@/common/slideOut/slideOutSaves.types'
import { useStoredState } from '@/common/storage.hooks'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function SlideOutSettingsView() {
  const [settings, setSettings] = useStoredState<SlideOutSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 pb-8">
      <ScreenHeader title="Settings" back={[GAME_ROUTE.SLIDE_OUT]} />
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
    </main>
  )
}
