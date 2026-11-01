import { AssistSettings } from '@/shared/screens/AssistSettings/AssistSettings'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  DRAW_MODE,
  DRAW_MODE_LABEL,
} from '@/games/solitaire/engine/solitaire.constants'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
} from '@/games/solitaire/engine/solitaireSaves.constants'
import type { SolitaireSettings } from '@/games/solitaire/engine/solitaireSaves.types'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { OptionGroup } from '@/shared/ui/OptionGroup/OptionGroup'
import { SettingsScreen } from '@/shared/screens/SettingsScreen/SettingsScreen'
import { SettingRow } from '@/shared/screens/SettingRow/SettingRow'

export function SolitaireSettingsView() {
  const [settings, setSettings] = useStoredState<SolitaireSettings>({
    key: SETTINGS_KEY,
    fallback: DEFAULT_SETTINGS,
  })

  function set(patch: Partial<SolitaireSettings>) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  return (
    <SettingsScreen game={GAME_ROUTE.SOLITAIRE}>
      <h2 className="pt-2 font-semibold text-game">Play</h2>
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
        detail="Checks after a full pass through the stock with no move, and offers to undo to the last winnable position."
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
      <AssistSettings
        assists={settings}
        hintStyles
        reveal={false}
        onChange={set}
      />
    </SettingsScreen>
  )
}
