export function KakuroIcon() {
  return (
    <span
      className="grid grid-cols-3 gap-px bg-kk-line p-px text-[0.55rem] font-semibold"
      aria-hidden
    >
      <span className="size-3.5 bg-kk-block" />
      <span className="flex size-3.5 items-end justify-start bg-kk-block pl-px text-kk-clue">
        4
      </span>
      <span className="flex size-3.5 items-end justify-start bg-kk-block pl-px text-kk-clue">
        6
      </span>
      <span className="flex size-3.5 items-start justify-end bg-kk-block pr-px text-kk-clue">
        3
      </span>
      <span className="flex size-3.5 items-center justify-center bg-kk-background text-kk-digit">
        1
      </span>
      <span className="flex size-3.5 items-center justify-center bg-kk-background text-kk-digit">
        2
      </span>
    </span>
  )
}
