import { Dialog } from '@base-ui/react/dialog'
import type { ReactNode } from 'react'

export function AppDialog({
  open,
  title,
  onClose,
  children,
  actions,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  actions: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-popover p-5 text-popover-foreground shadow-xl">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            {children}
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">{actions}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
