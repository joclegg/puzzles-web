import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { AppDialog } from '@/components/AppDialog/AppDialog'
import { Button } from '@/components/Button/Button'
import { BUTTON_VARIANT } from '@/components/Button/Button.constants'

export function DeleteAccount({
  onDeleteAccount,
}: {
  onDeleteAccount: () => Promise<boolean>
}) {
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  function close() {
    setConfirming(false)
    setFailed(false)
  }

  async function confirm() {
    setBusy(true)
    setFailed(false)
    const deleted = await onDeleteAccount()
    setBusy(false)
    if (deleted) {
      setConfirming(false)
    } else {
      setFailed(true)
    }
  }

  return (
    <section className="mt-6 grid gap-2">
      <h2 className="font-semibold">Account</h2>
      <p className="text-sm text-muted-foreground">
        Delete your account and everything synced to it.
      </p>
      <div>
        <Button
          variant={BUTTON_VARIANT.OUTLINE}
          onClick={() => setConfirming(true)}
        >
          <Trash2 />
          Delete account
        </Button>
      </div>
      <AppDialog
        open={confirming}
        title="Delete account?"
        onClose={close}
        actions={
          <>
            <Button variant={BUTTON_VARIANT.OUTLINE} onClick={close}>
              Cancel
            </Button>
            <Button
              variant={BUTTON_VARIANT.OUTLINE}
              disabled={busy}
              onClick={() => void confirm()}
            >
              Delete account
            </Button>
          </>
        }
      >
        <p>
          Your synced scores, history and settings on the server are deleted for
          good. This can't be undone.
        </p>
        <p>
          Games and settings saved in this browser stay here, and you are signed
          out.
        </p>
        {failed && (
          <p role="alert" className="text-destructive">
            We couldn't delete your account. Check your connection and try
            again.
          </p>
        )}
      </AppDialog>
    </section>
  )
}
