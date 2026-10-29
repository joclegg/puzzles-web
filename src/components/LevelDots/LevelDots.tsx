import { cn } from '@/common/utils.functions'

export function LevelDots({ rank, count }: { rank: number; count: number }) {
  return (
    <span aria-hidden className="flex gap-1">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 w-3 rounded-full',
            i <= rank ? 'bg-game' : 'bg-muted-foreground/20',
          )}
        />
      ))}
    </span>
  )
}
