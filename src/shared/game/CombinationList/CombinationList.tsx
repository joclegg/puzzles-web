import type { CombinationLine } from '@/shared/game/combinations.types'

export function CombinationList({ lines }: { lines: CombinationLine[] }) {
  return (
    <ul
      className="w-full max-w-md text-sm text-muted-foreground"
      aria-label="Combinations"
    >
      {lines.map((line) => (
        <li key={line.label}>
          {line.label}:{' '}
          {line.options.length === 0
            ? 'none fit'
            : line.options.map((option) => (
                <span
                  key={option.map((it) => it.digit).join('')}
                  className="mr-3"
                >
                  {option.map((it) => (
                    <span
                      key={it.digit}
                      className={
                        it.placed ? 'font-bold text-foreground' : undefined
                      }
                    >
                      {it.digit}
                    </span>
                  ))}
                </span>
              ))}
        </li>
      ))}
    </ul>
  )
}
