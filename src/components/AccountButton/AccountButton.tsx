import { LogIn, LogOut } from 'lucide-react'

import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'

export function AccountButton({
  email,
  onSignIn,
  onSignOut,
}: {
  email: string | null
  onSignIn: () => void
  onSignOut: () => void
}) {
  return email === null ? (
    <Button
      variant={BUTTON_VARIANT.OUTLINE}
      size={BUTTON_SIZE.DEFAULT}
      onClick={onSignIn}
    >
      <LogIn />
      Sign in to sync
    </Button>
  ) : (
    <Button
      variant={BUTTON_VARIANT.OUTLINE}
      size={BUTTON_SIZE.DEFAULT}
      title={email}
      onClick={onSignOut}
    >
      <LogOut />
      Sign out
    </Button>
  )
}
