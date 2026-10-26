import { cn } from '@/common/utils.functions'
import type { PadTool } from '@/components/NumberPad/NumberPad.types'

export function NumberPad({
  digits,
  activeDigit,
  doneDigits,
  disabledDigits = new Set(),
  badges = new Map(),
  tools,
  onDigit,
}: {
  digits: readonly number[]
  activeDigit: number | null
  doneDigits: Set<number>
  disabledDigits?: Set<number>
  badges?: Map<number, string>
  tools: readonly PadTool[]
  onDigit: (digit: number) => void
}) {
  return (
    <div
      role="group"
      aria-label="Number pad"
      className="grid w-full max-w-md grid-cols-6 gap-1.5 lg:max-w-[min(100%,calc(100dvh-16rem))]"
    >
      {digits.map((digit) => (
        <button
          key={digit}
          type="button"
          aria-label={`Digit ${digit}`}
          aria-pressed={activeDigit === digit}
          disabled={disabledDigits.has(digit)}
          onClick={() => onDigit(digit)}
          className={cn(
            'relative h-12 rounded-lg bg-muted text-xl font-semibold active:opacity-70 disabled:opacity-30',
            activeDigit === digit && 'bg-primary text-primary-foreground',
            doneDigits.has(digit) && 'opacity-40',
          )}
        >
          {digit}
          {badges.has(digit) && (
            <span className="absolute top-0.5 right-1 text-[0.6rem] font-medium opacity-70">
              {badges.get(digit)}
            </span>
          )}
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
