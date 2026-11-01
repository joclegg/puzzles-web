import { cn } from '@/shared/lib/utils.functions'
import type { Dot } from '@/games/sightlines/engine/sightlines.types'
import { DOT_CLASS } from '@/games/sightlines/ui/SightlinesBoard/SightlinesBoard.constants'
import { COLOUR_CHOICES } from '@/games/sightlines/ui/SightlinesColourPicker/SightlinesColourPicker.constants'

export function SightlinesColourPicker({
  colour,
  onColour,
}: {
  colour: Dot
  onColour: (dot: Dot) => void
}) {
  return (
    <div className="flex gap-3" role="radiogroup" aria-label="Colour">
      {COLOUR_CHOICES.map((choice) => (
        <button
          key={choice.dot}
          type="button"
          role="radio"
          aria-checked={colour === choice.dot}
          aria-label={choice.label}
          onClick={() => onColour(choice.dot)}
          className={cn(
            'size-12 rounded-full border-b-4',
            DOT_CLASS[choice.dot],
            colour === choice.dot && 'ring-3 ring-foreground',
          )}
        />
      ))}
    </div>
  )
}
