import { cn } from '@/common/utils.functions'
import type { Tile } from '@/common/twoTone/twoTone.types'
import { TILE_CLASS } from '@/components/TwoToneBoard/TwoToneBoard.constants'
import { COLOUR_CHOICES } from '@/components/TwoToneColourPicker/TwoToneColourPicker.constants'

export function TwoToneColourPicker({
  colour,
  onColour,
}: {
  colour: Tile
  onColour: (tile: Tile) => void
}) {
  return (
    <div className="flex gap-3" role="radiogroup" aria-label="Colour">
      {COLOUR_CHOICES.map((choice) => (
        <button
          key={choice.tile}
          type="button"
          role="radio"
          aria-checked={colour === choice.tile}
          aria-label={choice.label}
          onClick={() => onColour(choice.tile)}
          className={cn(
            'size-12 rounded-full border-b-4',
            TILE_CLASS[choice.tile],
            colour === choice.tile && 'ring-3 ring-foreground',
          )}
        />
      ))}
    </div>
  )
}
