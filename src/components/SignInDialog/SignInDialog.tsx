import { useState } from 'react'

import {
  EMAIL_CODE_LENGTH,
  SIGN_IN_PROVIDER,
  SIGN_IN_STEP,
} from '@/common/sync.constants'
import { cleanEmailCode, isEmailAddress } from '@/common/sync.functions'
import type { SignInProvider, SignInStep } from '@/common/sync.types'
import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import { BUTTON_VARIANT } from '@/components/Button/Button.constants'
import { ProviderButton } from '@/components/ProviderButton/ProviderButton'

const CODE_FORM_ID = 'sign-in-code'
const EMAIL_FORM_ID = 'sign-in-email'
const FIELD_CLASS =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function SignInDialog({
  open,
  onClose,
  onSignIn,
  onSendEmailLink,
  onVerifyEmailCode,
}: {
  open: boolean
  onClose: () => void
  onSignIn: (provider: SignInProvider) => void
  onSendEmailLink: (email: string) => Promise<boolean>
  onVerifyEmailCode: (entry: {
    email: string
    code: string
  }) => Promise<boolean>
}) {
  const [step, setStep] = useState<SignInStep>(SIGN_IN_STEP.CHOOSE)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  function close() {
    setStep(SIGN_IN_STEP.CHOOSE)
    setCode('')
    setFailed(false)
    onClose()
  }

  async function sendLink() {
    setBusy(true)
    setFailed(false)
    const sent = await onSendEmailLink(email)
    setBusy(false)
    if (sent) {
      setStep(SIGN_IN_STEP.CODE)
    } else {
      setFailed(true)
    }
  }

  async function verifyCode() {
    setBusy(true)
    setFailed(false)
    const verified = await onVerifyEmailCode({ email, code })
    setBusy(false)
    if (verified) {
      close()
    } else {
      setFailed(true)
    }
  }

  if (step === SIGN_IN_STEP.CODE) {
    return (
      <AppDialog
        open={open}
        title="Check your email"
        onClose={close}
        actions={
          <>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              onClick={() => {
                setStep(SIGN_IN_STEP.CHOOSE)
                setCode('')
                setFailed(false)
              }}
            >
              Use a different email
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              type="submit"
              form={CODE_FORM_ID}
              disabled={busy || code.length < EMAIL_CODE_LENGTH}
            >
              Sign in
            </Button>
          </>
        }
      >
        <p>
          We sent a sign-in link and a code to {email.trim()}. Open the link in
          this browser, or enter the code.
        </p>
        <form
          id={CODE_FORM_ID}
          onSubmit={(event) => {
            event.preventDefault()
            void verifyCode()
          }}
        >
          <input
            className={FIELD_CLASS}
            aria-label="Code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Code"
            value={code}
            onChange={(event) => setCode(cleanEmailCode(event.target.value))}
          />
        </form>
        {failed && (
          <p role="alert" className="text-destructive">
            That code didn't work. Check it, or send a new one.
          </p>
        )}
      </AppDialog>
    )
  }

  return (
    <AppDialog
      open={open}
      title="Sign in to sync"
      onClose={close}
      actions={
        <>
          <Button variant={BUTTON_VARIANT.OUTLINE} onClick={close}>
            Cancel
          </Button>
          <Button
            variant={BUTTON_VARIANT.OUTLINE}
            type="submit"
            form={EMAIL_FORM_ID}
            disabled={busy || !isEmailAddress(email)}
          >
            Email me a link
          </Button>
        </>
      }
    >
      <p>
        Sync your games and settings with other browsers and the Android app.
      </p>
      <div className="grid gap-2 pt-2">
        <ProviderButton
          provider={SIGN_IN_PROVIDER.GOOGLE}
          onClick={() => onSignIn(SIGN_IN_PROVIDER.GOOGLE)}
        />
        <ProviderButton
          provider={SIGN_IN_PROVIDER.MICROSOFT}
          onClick={() => onSignIn(SIGN_IN_PROVIDER.MICROSOFT)}
        />
      </div>
      <div className="flex items-center gap-3 py-1 text-xs">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <form
        id={EMAIL_FORM_ID}
        onSubmit={(event) => {
          event.preventDefault()
          void sendLink()
        }}
      >
        <input
          className={FIELD_CLASS}
          aria-label="Email"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </form>
      {failed && (
        <p role="alert" className="text-destructive">
          We couldn't send the email. Try again in a minute.
        </p>
      )}
    </AppDialog>
  )
}
