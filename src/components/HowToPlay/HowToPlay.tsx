import { CircleHelp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import type { TutorialStep } from '@/common/assists.types'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { Walkthrough } from '@/components/Walkthrough/Walkthrough'

export function HowToPlay({
  steps,
  children,
}: {
  steps: TutorialStep[]
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [walking, setWalking] = useState(false)

  return (
    <>
      <Button
        size={BUTTON_SIZE.ICON}
        aria-label="Show the rules"
        onClick={() => setOpen(true)}
      >
        <CircleHelp className="size-5" />
      </Button>
      <AppDialog
        open={open}
        title="How to play"
        onClose={() => setOpen(false)}
        actions={
          <>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => {
                setOpen(false)
                setWalking(true)
              }}
            >
              Walk me through it
            </Button>
            <Button onClick={() => setOpen(false)}>Got it</Button>
          </>
        }
      >
        {children}
      </AppDialog>
      {walking && (
        <Walkthrough steps={steps} onClose={() => setWalking(false)} />
      )}
    </>
  )
}
