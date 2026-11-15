import type { Ref } from 'react'

import { SENTINEL } from '@/games/crossword/engine/crossword.constants'

export function CrosswordInput({
  ref,
  onKey,
  onText,
}: {
  ref: Ref<HTMLInputElement>
  onKey: (press: { key: string; shiftKey: boolean }) => boolean
  onText: (value: string) => void
}) {
  return (
    <input
      ref={ref}
      type="text"
      aria-label="Type letters"
      data-testid="crossword_keyboard"
      defaultValue={SENTINEL}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="characters"
      spellCheck={false}
      inputMode="text"
      enterKeyHint="next"
      autoFocus
      className="pointer-events-none absolute top-0 left-0 size-4 border-0 bg-transparent p-0 text-base text-transparent caret-transparent opacity-0 outline-none"
      onFocus={(event) =>
        event.currentTarget.setSelectionRange(SENTINEL.length, SENTINEL.length)
      }
      onKeyDown={(event) => {
        if (
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          event.nativeEvent.isComposing
        ) {
          return
        }
        if (onKey({ key: event.key, shiftKey: event.shiftKey })) {
          event.preventDefault()
        }
      }}
      onInput={(event) => {
        const input = event.currentTarget
        const value = input.value
        input.value = SENTINEL
        input.setSelectionRange(SENTINEL.length, SENTINEL.length)
        onText(value)
      }}
    />
  )
}
