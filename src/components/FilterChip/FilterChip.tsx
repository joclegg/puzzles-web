import { cn } from '@/common/utils.functions'

export function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'min-w-11 rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition active:scale-95',
        selected
          ? 'bg-game text-background ring-game'
          : 'bg-card ring-border hover:bg-muted',
      )}
    >
      {label}
    </button>
  )
}
