import { History } from 'lucide-react'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-game/12 text-game">
        <History className="size-6" aria-hidden />
      </span>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
