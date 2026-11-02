import { Menu } from '@base-ui/react/menu'
import { EllipsisVertical } from 'lucide-react'

import type { MenuItem } from '@/shared/ui/MoreMenu/MoreMenu.types'

export function MoreMenu({ items }: { items: readonly MenuItem[] }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="More"
        className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"
      >
        <EllipsisVertical className="size-5" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="z-50" align="end" sideOffset={4}>
          <Menu.Popup className="min-w-40 rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-border">
            {items.map((item) => (
              <Menu.Item
                key={item.label}
                onClick={item.onClick}
                className="cursor-default rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-muted"
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
