import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/games/crossword/engine/crosswordSaves.constants'
import type { CrosswordSettings } from '@/games/crossword/engine/crosswordSaves.types'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { SettingsScreen } from '@/shared/screens/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/shared/screens/SettingRow/SettingRow'

export function CrosswordSettingsView() {
  const [settings, setSettings] = useStoredState<CrosswordSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  function set(patch: Partial<CrosswordSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <SettingsScreen game={GAME_ROUTE.CROSSWORD}>
      <h2 className="pt-2 font-semibold text-game">Typing</h2>
      <SettingRow
        label="Skip filled cells"
        testId="setting_skip_filled_cells"
        detail="When typing, jump over cells that already have a letter."
        checked={settings.skipFilledCells}
        onChange={(skipFilledCells) => set({ skipFilledCells })}
      />
      <SettingRow
        label="Show the timer"
        testId="setting_show_timer"
        checked={settings.showTimer}
        onChange={(showTimer) => set({ showTimer })}
      />
      <section aria-label="Help">
        <h2 className="pt-4 font-semibold text-game">Help</h2>
        <SettingRow
          label="Show mistakes"
          testId="setting_show_mistakes"
          detail="Colour wrong letters red."
          checked={settings.showMistakes}
          onChange={(showMistakes) => set({ showMistakes })}
        />
        <SettingRow
          label="Reveal"
          testId="setting_allow_reveal"
          detail="Offer Reveal letter, Reveal word and Reveal puzzle in the game menu."
          checked={settings.allowReveal}
          onChange={(allowReveal) => set({ allowReveal })}
        />
      </section>
    </SettingsScreen>
  )
}
