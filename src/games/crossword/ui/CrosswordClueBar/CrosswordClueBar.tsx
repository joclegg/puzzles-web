import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_SIZE } from '@/shared/ui/Button/Button.constants'

export function CrosswordClueBar({
  label,
  clue,
  onStep,
}: {
  label: string
  clue: string
  onStep: (step: number) => void
}) {
  return (
    <div
      data-testid="clue_bar"
      className="flex w-full items-center gap-1 rounded-lg bg-cw-word px-1 py-1.5 text-cw-letter"
    >
      <Button
        size={BUTTON_SIZE.ICON}
        aria-label="Previous clue"
        data-testid="clue_previous"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onStep(-1)}
      >
        <ChevronLeft className="size-5" />
      </Button>
      <p
        className="min-h-10 flex-1 text-center text-sm leading-5"
        aria-label="Current clue"
        aria-live="polite"
      >
        <span className="font-semibold">{label}</span> {clue}
      </p>
      <Button
        size={BUTTON_SIZE.ICON}
        aria-label="Next clue"
        data-testid="clue_next"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onStep(1)}
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  )
}
