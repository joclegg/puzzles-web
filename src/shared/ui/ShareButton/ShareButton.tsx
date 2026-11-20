import { Share2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_VARIANT } from '@/shared/ui/Button/Button.constants'

export function ShareButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false)

  async function onShare() {
    if (navigator.share) {
      await navigator.share({ text }).catch(() => undefined)
      return
    }
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <Button
      variant={BUTTON_VARIANT.OUTLINE}
      aria-label={label}
      onClick={() => void onShare()}
    >
      <Share2 className="size-4" />
      {copied ? 'Copied' : 'Share'}
    </Button>
  )
}
