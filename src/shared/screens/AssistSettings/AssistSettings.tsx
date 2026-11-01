import { HINT_STYLE } from '@/shared/game/assists.constants'
import type { Assists } from '@/shared/game/assists.types'
import { SettingRow } from '@/shared/screens/SettingRow/SettingRow'

export function AssistSettings({
  assists,
  hintStyles = false,
  reveal = true,
  onChange,
}: {
  assists: Assists
  hintStyles?: boolean
  reveal?: boolean
  onChange: (patch: Partial<Assists>) => void
}) {
  return (
    <section aria-label="Help">
      <h2 className="pt-4 font-semibold text-game">Help</h2>
      <SettingRow
        label="Hints"
        detail="Show the hint button."
        checked={assists.showHints}
        onChange={(showHints) => onChange({ showHints })}
      />
      <SettingRow
        label="How to play"
        detail="Show the ? button with the rules and a walkthrough."
        checked={assists.showTutorial}
        onChange={(showTutorial) => onChange({ showTutorial })}
      />
      {hintStyles && assists.showHints && (
        <SettingRow
          label="Hints fill the answer in"
          detail="Off: a hint points at the next step and says why."
          checked={assists.hintStyle === HINT_STYLE.FILL}
          onChange={(fill) =>
            onChange({ hintStyle: fill ? HINT_STYLE.FILL : HINT_STYLE.POINT })
          }
        />
      )}
      {reveal && (
        <SettingRow
          label="Show solution"
          detail="Offer Show solution in the game menu."
          checked={assists.allowReveal}
          onChange={(allowReveal) => onChange({ allowReveal })}
        />
      )}
    </section>
  )
}
