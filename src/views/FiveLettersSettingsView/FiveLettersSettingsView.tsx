import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/fiveLetters/fiveLettersSaves.constants'
import type { FiveLettersSettings } from '@/common/fiveLetters/fiveLettersSaves.types'
import { GAME_ROUTE } from '@/common/route.constants'
import { useStoredState } from '@/common/storage.hooks'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function FiveLettersSettingsView() {
  const [settings, setSettings] = useStoredState<FiveLettersSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 pb-8">
      <ScreenHeader title="Settings" back={[GAME_ROUTE.FIVE_LETTERS]} />
      <SettingRow
        label="Hard mode"
        detail="Every hint must be used in later guesses. Applies to new games."
        checked={settings.hardMode}
        onChange={(hardMode) =>
          setSettings((current) => ({ ...current, hardMode }))
        }
      />
      <SettingRow
        label="High contrast"
        detail="Orange and blue instead of green and yellow"
        checked={settings.highContrast}
        onChange={(highContrast) =>
          setSettings((current) => ({ ...current, highContrast }))
        }
      />
      <SettingRow
        label="Use the New York Times word"
        detail="The daily game uses today's Wordle answer, fetched from nytimes.com through the free r.jina.ai reader. Falls back to the Puzzles word when that fails. Applies to new daily games."
        checked={settings.nytWord}
        onChange={(nytWord) =>
          setSettings((current) => ({ ...current, nytWord }))
        }
      />
    </main>
  )
}
