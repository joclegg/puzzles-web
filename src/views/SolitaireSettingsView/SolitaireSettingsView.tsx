import { GAME_ROUTE } from '@/common/route.constants'
import {
  DRAW_MODE,
  DRAW_MODE_LABEL,
} from '@/common/solitaire/solitaire.constants'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/common/solitaire/solitaireSaves.constants'
import type { SolitaireSettings } from '@/common/solitaire/solitaireSaves.types'
import { useStoredState } from '@/common/storage.hooks'
import { OptionGroup } from '@/components/OptionGroup/OptionGroup'
import { ScreenHeader } from '@/components/ScreenHeader/ScreenHeader'
import { SettingRow } from '@/components/SettingRow/SettingRow'

export function SolitaireSettingsView() {
  const [settings, setSettings] = useStoredState<SolitaireSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  function set(patch: Partial<SolitaireSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 pb-8">
      <ScreenHeader title="Settings" back={[GAME_ROUTE.SOLITAIRE]} />
      <h2 className="pt-2 font-semibold">Play</h2>
      <OptionGroup
        label="Draw"
        options={Object.values(DRAW_MODE)}
        value={settings.drawMode}
        labels={DRAW_MODE_LABEL}
        onChange={(drawMode) => set({ drawMode })}
      />
      <p className="text-sm text-muted-foreground">
        Draw 3 is harder. Applies to new games.
      </p>
      <SettingRow
        label="Reverse"
        detail="Foundations start with kings, columns build up from aces. Applies to new games."
        checked={settings.reverse}
        onChange={(reverse) => set({ reverse })}
      />
      <SettingRow
        label="One tap to move"
        detail="Tapping a card sends it to the best place. Off: tap a card, then where it should go."
        checked={settings.oneTapMove}
        onChange={(oneTapMove) => set({ oneTapMove })}
      />
      <SettingRow
        label="Winnable deals only"
        detail="Every new deal can be won. Applies to new deals."
        checked={settings.winnableOnly}
        onChange={(winnableOnly) => set({ winnableOnly })}
      />
      <SettingRow
        label="Tell me when a deal can't be won"
        detail="Checks once you have been through the whole stock without playing a card, and offers to undo back to the last winnable position."
        checked={settings.warnUnwinnable}
        onChange={(warnUnwinnable) => set({ warnUnwinnable })}
      />
      <SettingRow
        label="Show the timer"
        checked={settings.showTimer}
        onChange={(showTimer) => set({ showTimer })}
      />
      <SettingRow
        label="Show the move counter"
        checked={settings.showMoveCount}
        onChange={(showMoveCount) => set({ showMoveCount })}
      />
    </main>
  )
}
