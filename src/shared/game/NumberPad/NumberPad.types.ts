import type { LucideIcon } from 'lucide-react'

export interface PadTool {
  label: string
  icon: LucideIcon
  onClick: () => void
  on: boolean
}
