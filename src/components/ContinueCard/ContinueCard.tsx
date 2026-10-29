import { ChevronRight, Play } from 'lucide-react'

export function ContinueCard({
  detail,
  onClick,
}: {
  detail: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-game/40 transition hover:bg-muted active:scale-[0.99]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-game text-background shadow-sm">
        <Play className="size-5 translate-x-px fill-current" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">Continue</span>
        <span className="block truncate text-sm text-muted-foreground">
          {detail}
        </span>
      </span>
      <ChevronRight
        className="size-5 text-muted-foreground transition group-hover:translate-x-0.5"
        aria-hidden
      />
    </button>
  )
}
