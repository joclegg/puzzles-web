import { ArrowLeft } from 'lucide-react'

import { navigate } from '@/common/route.hooks'
import { Button } from '@/components/Button/Button'
import { BUTTON_SIZE } from '@/components/Button/Button.constants'

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
