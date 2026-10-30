import { cn } from '@/common/utils.functions'

export function OptionGroup<T extends string>({
  label,
  options,
  value,
  labels,
  onChange,
}: {
  label: string
  options: readonly T[]
  value: T
  labels: Record<T, string>
  onChange: (value: T) => void
}) {
  return (
    <div className="flex gap-2 py-3" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-sm ring-1 ring-border',
            value === option && 'bg-game text-background ring-game',
          )}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  )
}
