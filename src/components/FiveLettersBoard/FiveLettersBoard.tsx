import { cn } from '@/common/utils.functions'
import {
  MAX_GUESSES,
  WORD_LENGTH,
} from '@/common/fiveLetters/fiveLetters.constants'
import { guessMarks } from '@/common/fiveLetters/fiveLetters.functions'
import type { FiveLettersGame } from '@/common/fiveLetters/fiveLetters.types'
import {
  EMPTY_TILE_CLASS,
  MARK_TILE_CLASS,
  TILE_BASE_CLASS,
  TYPED_TILE_CLASS,
} from '@/components/FiveLettersBoard/FiveLettersBoard.constants'

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
      className="grid w-[min(100%,calc((100dvh-22rem)*5/6))] gap-1.5"
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
