import { AppDialog } from '@/shared/ui/AppDialog/AppDialog'
import { BANK_LOAD } from '@/shared/bank/BankLoader/BankLoader.constants'
import type { BankLoad } from '@/shared/bank/BankLoader/BankLoader.types'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_VARIANT } from '@/shared/ui/Button/Button.constants'

export function BankLoader({ load }: { load: BankLoad }) {
  const failed = load.status === BANK_LOAD.FAILED
  return (
    <AppDialog
      open={load.status !== BANK_LOAD.IDLE}
      title={failed ? "Couldn't load the puzzle" : 'Loading the puzzle'}
      onClose={load.cancel}
      actions={
        <>
          <Button variant={BUTTON_VARIANT.OUTLINE} onClick={load.cancel}>
            Cancel
          </Button>
          {failed && <Button onClick={load.retry}>Try again</Button>}
        </>
      }
    >
      <p role="status">
        {failed
          ? 'Check your connection and try again.'
          : 'Downloading this puzzle. It only takes a moment.'}
      </p>
    </AppDialog>
  )
}
