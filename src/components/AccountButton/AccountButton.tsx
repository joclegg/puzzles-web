import { LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'

import type { SignInProvider } from '@/common/sync.types'
import { Button } from '@/components/Button/Button'
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/Button/Button.constants'
import { SignInDialog } from '@/components/SignInDialog/SignInDialog'

export function AccountButton({
  email,
  onSignIn,
  onSendEmailLink,
  onVerifyEmailCode,
  onSignOut,
}: {
  email: string | null
  onSignIn: (provider: SignInProvider) => void
  onSendEmailLink: (email: string) => Promise<boolean>
  onVerifyEmailCode: (entry: {
    email: string
    code: string
  }) => Promise<boolean>
  onSignOut: () => void
}) {
  const [choosing, setChoosing] = useState(false)

  if (email !== null) {
    return (
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

  return (
    <>
      <Button
        variant={BUTTON_VARIANT.OUTLINE}
        size={BUTTON_SIZE.DEFAULT}
        onClick={() => setChoosing(true)}
      >
        <LogIn />
        Sign in to sync
      </Button>
      <SignInDialog
        open={choosing}
        onClose={() => setChoosing(false)}
        onSignIn={onSignIn}
        onSendEmailLink={onSendEmailLink}
        onVerifyEmailCode={onVerifyEmailCode}
      />
    </>
  )
}
