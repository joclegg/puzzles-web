import { useState } from 'react'

import {
  APP_PROMPT_CHOICE,
  APP_PROMPT_KEY,
} from '@/shared/lib/appStore.constants'
import { mobilePlatformOf, storeUrlFor } from '@/shared/lib/appStore.functions'
import type { AppPromptChoice } from '@/shared/lib/appStore.types'
import { cn } from '@/shared/lib/utils.functions'
import { useStoredState } from '@/shared/storage/storage.hooks'
import { AppDialog } from '@/shared/ui/AppDialog/AppDialog'
import { Button } from '@/shared/ui/Button/Button'
import {
  BUTTON_BASE_CLASS,
  BUTTON_SIZE,
  BUTTON_SIZE_CLASS,
  BUTTON_VARIANT,
  BUTTON_VARIANT_CLASS,
} from '@/shared/ui/Button/Button.constants'

export function AppPromptDialog() {
  const [storeUrl] = useState(() =>
    storeUrlFor(
      mobilePlatformOf({
        userAgent: navigator.userAgent,
        maxTouchPoints: navigator.maxTouchPoints,
      }),
    ),
  )
  const [choice, setChoice] = useStoredState<AppPromptChoice | null>({
    key: APP_PROMPT_KEY,
    fallback: null,
  })
  if (!storeUrl) return null
  return (
    <AppDialog
      open={choice === null}
      title="Get the Puzzles app"
      onClose={() => setChoice(() => APP_PROMPT_CHOICE.WEB)}
      actions={
        <>
          <Button
            variant={BUTTON_VARIANT.OUTLINE}
            onClick={() => setChoice(() => APP_PROMPT_CHOICE.WEB)}
          >
            Keep playing here
          </Button>
          <a
            href={storeUrl}
            onClick={() => setChoice(() => APP_PROMPT_CHOICE.APP)}
            className={cn(
              BUTTON_BASE_CLASS,
              BUTTON_VARIANT_CLASS[BUTTON_VARIANT.OUTLINE],
              BUTTON_SIZE_CLASS[BUTTON_SIZE.DEFAULT],
              'bg-foreground text-background',
            )}
          >
            Open the app
          </a>
        </>
      }
    >
      <p>
        The same nine puzzles, made for your phone. Sign in on both to keep your
        games in sync.
      </p>
    </AppDialog>
  )
}
