import { LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'

import { SIGN_IN_PROVIDER } from '@/common/sync.constants'
import type { SignInProvider } from '@/common/sync.types'
import { AppDialog } from '@/components/AppDialog/AppDialog'
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
  onSignIn: (provider: SignInProvider) => void
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
      <AppDialog
        open={choosing}
        title="Sign in to sync"
        onClose={() => setChoosing(false)}
        actions={
          <>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => onSignIn(SIGN_IN_PROVIDER.GOOGLE)}
            >
              Google
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => onSignIn(SIGN_IN_PROVIDER.MICROSOFT)}
            >
              Microsoft
            </Button>
          </>
        }
      >
        <p>
          Sync your games and settings with other browsers and the Android app.
        </p>
      </AppDialog>
    </>
  )
}
