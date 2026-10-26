import { cn } from '@/common/utils.functions'
import type { PadTool } from '@/components/NumberPad/NumberPad.types'

export function NumberPad({
  digits,
  activeDigit,
  doneDigits,
  tools,
  onDigit,
}: {
  digits: readonly number[]
  activeDigit: number | null
  doneDigits: Set<number>
  tools: readonly PadTool[]
  onDigit: (digit: number) => void
}) {
  return (
    <div className="grid w-full max-w-md grid-cols-6 gap-1.5">
      {digits.map((digit) => (
        <button
          key={digit}
          type="button"
          aria-label={`Digit ${digit}`}
          aria-pressed={activeDigit === digit}
          onClick={() => onDigit(digit)}
          className={cn(
            'h-12 rounded-lg bg-muted text-xl font-semibold active:opacity-70',
            activeDigit === digit && 'bg-primary text-primary-foreground',
            doneDigits.has(digit) && 'opacity-40',
          )}
        >
          {digit}
        </button>
      ))}
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          aria-label={tool.label}
          title={tool.label}
          aria-pressed={tool.on}
          onClick={tool.onClick}
          className={cn(
            'flex h-12 items-center justify-center rounded-lg bg-muted active:opacity-70',
            tool.on && 'bg-primary text-primary-foreground',
          )}
        >
          <tool.icon className="size-5" />
        </button>
      ))}
    </div>
  )
}
