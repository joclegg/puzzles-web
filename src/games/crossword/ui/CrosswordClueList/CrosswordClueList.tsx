import type { Word } from '@/games/crossword/engine/crossword.types'
import { cn } from '@/shared/lib/utils.functions'

export function CrosswordClueList({
  title,
  words,
  current,
  clueOf,
  onWord,
}: {
  title: string
  words: Word[]
  current: Word
  clueOf: (word: Word) => string
  onWord: (word: Word) => void
}) {
  return (
    <section aria-label={title} className="min-w-0 flex-1">
      <h2 className="pb-1 text-sm font-semibold text-game">{title}</h2>
      <ol className="flex flex-col gap-0.5">
        {words.map((word) => (
          <li key={`${word.number}${word.isAcross}`}>
            <button
              type="button"
              tabIndex={-1}
              data-testid={`clue_${word.number}_${word.isAcross ? 'across' : 'down'}`}
              aria-current={word === current}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onWord(word)}
              className={cn(
                'flex w-full gap-2 rounded px-1.5 py-0.5 text-left text-sm',
                word === current && 'bg-cw-word font-medium',
              )}
            >
              <span className="w-5 shrink-0 text-right font-semibold">
                {word.number}
              </span>
              <span>{clueOf(word)}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
