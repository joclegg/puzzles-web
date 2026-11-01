import { AssistSettings } from '@/components/AssistSettings/AssistSettings'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/fiveLetters/fiveLettersSaves.constants'
import type { FiveLettersSettings } from '@/common/fiveLetters/fiveLettersSaves.types'
import { GAME_ROUTE } from '@/common/route.constants'
import { useStoredState } from '@/common/storage.hooks'
import { SettingsScreen } from '@/components/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function FiveLettersSettingsView() {
  const [settings, setSettings] = useStoredState<FiveLettersSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  return (
    <SettingsScreen game={GAME_ROUTE.FIVE_LETTERS}>
      <SettingRow
        label="Hard mode"
        detail="Every green and yellow letter you find must be used in later guesses. Applies to new games."
        checked={settings.hardMode}
        onChange={(hardMode) =>
          setSettings((current) => ({ ...current, hardMode }))
        }
      />
      <SettingRow
        label="High contrast colours"
        detail="Orange and blue instead of green and yellow."
        checked={settings.highContrast}
        onChange={(highContrast) =>
          setSettings((current) => ({ ...current, highContrast }))
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
