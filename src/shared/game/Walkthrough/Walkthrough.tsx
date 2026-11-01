import { useEffect, useState } from 'react'

import type { TutorialStep } from '@/shared/game/assists.types'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_VARIANT } from '@/shared/ui/Button/Button.constants'
import { SPOTLIGHT_CLASSES } from '@/shared/game/Walkthrough/Walkthrough.constants'

export function Walkthrough({
  steps,
  onClose,
}: {
  steps: TutorialStep[]
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const step = steps[index]
  const last = index === steps.length - 1

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(step.target)
    if (target === null) {
      return
    }
    target.classList.add(...SPOTLIGHT_CLASSES)
    target.scrollIntoView({ block: 'nearest' })
    return () => target.classList.remove(...SPOTLIGHT_CLASSES)
  }, [step.target])

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" aria-hidden />
      <div
        role="dialog"
        aria-label="Walkthrough"
        className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-xl bg-popover p-4 text-popover-foreground shadow-xl"
      >
        <p className="text-xs text-muted-foreground">
          Step {index + 1} of {steps.length}
        </p>
        <p className="mt-1">{step.text}</p>
        <div className="mt-3 flex justify-end gap-2">
          <Button variant={BUTTON_VARIANT.OUTLINE} onClick={onClose}>
            {last ? 'Close' : 'Skip'}
          </Button>
          {index > 0 && (
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => setIndex(index - 1)}
            >
              Back
            </Button>
          )}
          {!last && <Button onClick={() => setIndex(index + 1)}>Next</Button>}
        </div>
      </div>
    </>
  )
}
