import { AppDialog } from '@/shared/ui/AppDialog/AppDialog'
import { Button } from '@/shared/ui/Button/Button'
import { BUTTON_VARIANT } from '@/shared/ui/Button/Button.constants'

export function RevealDialog({
  open,
  onClose,
  onReveal,
}: {
  open: boolean
  onClose: () => void
  onReveal: () => void
}) {
  return (
    <AppDialog
      open={open}
      title="Show the solution?"
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant={BUTTON_VARIANT.OUTLINE} onClick={onReveal}>
            Show solution
          </Button>
        </>
      }
    >
      <p>This ends the puzzle. It won't count towards best times.</p>
    </AppDialog>
  )
}
