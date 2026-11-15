import type { ReactNode } from 'react'

import { HINT_STYLE } from '@/shared/game/assists.constants'
import type { Assists } from '@/shared/game/assists.types'
import { SettingRow } from '@/shared/screens/SettingRow/SettingRow'

export function AssistSettings({
  assists,
  hintStyles = false,
  reveal = true,
  tutorial = true,
  onChange,
  children,
}: {
  assists: Omit<Assists, 'showTutorial' | 'allowReveal'> &
    Partial<Pick<Assists, 'showTutorial' | 'allowReveal'>>
  hintStyles?: boolean
  reveal?: boolean
  tutorial?: boolean
  onChange: (patch: Partial<Assists>) => void
  children?: ReactNode
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
      {tutorial && (
        <SettingRow
          label="How to play"
          detail="Show the ? button with the rules and a walkthrough."
          checked={assists.showTutorial ?? false}
          onChange={(showTutorial) => onChange({ showTutorial })}
        />
      )}
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
          checked={assists.allowReveal ?? false}
          onChange={(allowReveal) => onChange({ allowReveal })}
        />
      )}
      {children}
    </section>
  )
}
