import { cn } from '@/shared/lib/utils.functions'
import {
  MAX_GUESSES,
  WORD_LENGTH,
} from '@/games/fiveLetters/engine/fiveLetters.constants'
import { guessMarks } from '@/games/fiveLetters/engine/fiveLetters.functions'
import type { FiveLettersGame } from '@/games/fiveLetters/engine/fiveLetters.types'
import {
  EMPTY_TILE_CLASS,
  MARK_TILE_CLASS,
  TILE_BASE_CLASS,
  TYPED_TILE_CLASS,
} from '@/games/fiveLetters/ui/FiveLettersBoard/FiveLettersBoard.constants'

export function FiveLettersBoard({ game }: { game: FiveLettersGame }) {
  const marks = guessMarks(game)
  const rows = Array.from({ length: MAX_GUESSES }, (_, row) =>
    row < game.guesses.length
      ? game.guesses[row]
      : row === game.guesses.length
        ? game.typing
        : '',
  )

  return (
    <div
      className="grid w-[min(100cqw,calc(100cqh*5/6))] gap-1.5"
      role="grid"
      aria-label="Guesses"
    >
      {rows.map((word, row) => (
        <div key={row} className="grid grid-cols-5 gap-1.5" role="row">
          {Array.from({ length: WORD_LENGTH }, (_, column) => {
            const letter = word[column] ?? ''
            const mark = marks[row]?.[column]
            return (
              <div
                key={column}
                role="gridcell"
                aria-label={mark ? `${letter} ${mark}` : letter || 'empty'}
                className={cn(
                  TILE_BASE_CLASS,
                  mark
                    ? MARK_TILE_CLASS[mark]
                    : letter
                      ? TYPED_TILE_CLASS
                      : EMPTY_TILE_CLASS,
                )}
              >
                {letter}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
