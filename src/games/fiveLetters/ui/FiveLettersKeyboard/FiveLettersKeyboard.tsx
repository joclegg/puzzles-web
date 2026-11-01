import { Delete } from 'lucide-react'

import { cn } from '@/shared/lib/utils.functions'
import type { Mark } from '@/games/fiveLetters/engine/fiveLetters.types'
import { KEY_ROWS } from '@/games/fiveLetters/engine/fiveLettersWords.constants'
import { MARK_TILE_CLASS } from '@/games/fiveLetters/ui/FiveLettersBoard/FiveLettersBoard.constants'
import { KEY_CLASS } from '@/games/fiveLetters/ui/FiveLettersKeyboard/FiveLettersKeyboard.constants'

export function FiveLettersKeyboard({
  letterMarks,
  onLetter,
  onEnter,
  onDelete,
}: {
  letterMarks: Map<string, Mark>
  onLetter: (letter: string) => void
  onEnter: () => void
  onDelete: () => void
}) {
  return (
    <div
      role="group"
      aria-label="Keyboard"
      className="flex w-full max-w-lg flex-col gap-1.5 px-1"
    >
      {KEY_ROWS.map((row, index) => (
        <div key={row} className="flex gap-1.5">
          {index === KEY_ROWS.length - 1 && (
            <button
              type="button"
              aria-label="Delete"
              className={cn(KEY_CLASS, 'flex-[1.5] bg-fl-key')}
              onClick={onDelete}
            >
              <Delete className="size-5" />
            </button>
          )}
          {[...row].map((letter) => {
            const mark = letterMarks.get(letter)
            return (
              <button
                key={letter}
                type="button"
                className={cn(
                  KEY_CLASS,
                  mark ? MARK_TILE_CLASS[mark] : 'bg-fl-key',
                )}
                onClick={() => onLetter(letter)}
              >
                {letter}
              </button>
            )
          })}
          {index === KEY_ROWS.length - 1 && (
            <button
              type="button"
              className={cn(KEY_CLASS, 'flex-[1.5] bg-fl-key')}
              onClick={onEnter}
            >
              ENTER
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
