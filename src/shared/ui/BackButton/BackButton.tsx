import { ArrowLeft } from 'lucide-react'

import { navigate } from '@/shared/lib/route.hooks'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_SIZE } from '@/shared/ui/Button/Button.constants'

export function BackButton({ to }: { to: readonly (string | number)[] }) {
  return (
    <Button
      size={BUTTON_SIZE.ICON}
      aria-label="Back"
      onClick={() => navigate(to)}
    >
      <ArrowLeft className="size-5" />
    </Button>
  )
}
