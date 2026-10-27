import { HINT_STYLE } from '@/common/assists.constants'
import type { Assists } from '@/common/assists.types'
import { HINT_STYLE_LABEL } from '@/components/AssistSettings/AssistSettings.constants'
import { OptionGroup } from '@/components/OptionGroup/OptionGroup'
import { SettingRow } from '@/components/SettingRow/SettingRow'

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
      <h2 className="pt-4 text-sm font-semibold text-muted-foreground">Help</h2>
      <SettingRow
        label="Hints"
        detail="Show the hint button."
        checked={assists.showHints}
        onChange={(showHints) => onChange({ showHints })}
      />
      {hintStyles && assists.showHints && (
        <OptionGroup
          label="Hint style"
          options={Object.values(HINT_STYLE)}
          value={assists.hintStyle}
          labels={HINT_STYLE_LABEL}
          onChange={(hintStyle) => onChange({ hintStyle })}
        />
      )}
      <SettingRow
        label="How to play"
        detail="Show the ? button with the rules and a walkthrough."
        checked={assists.showTutorial}
        onChange={(showTutorial) => onChange({ showTutorial })}
      />
      {reveal && (
        <SettingRow
          label="Show solution"
          detail="Offer Show solution in the ⋮ menu."
          checked={assists.allowReveal}
          onChange={(allowReveal) => onChange({ allowReveal })}
        />
      )}
    </section>
  )
}
