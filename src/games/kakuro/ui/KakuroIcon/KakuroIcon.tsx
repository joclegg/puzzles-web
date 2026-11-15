export function KakuroIcon() {
  return (
    <span
      className="grid size-11 grid-cols-2 grid-rows-2 gap-px bg-kk-line p-px text-sm leading-none text-kk-digit"
      aria-hidden
    >
      <span className="bg-kk-block bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),var(--kk-line),transparent_calc(50%+0.5px))]" />
      <span className="flex items-center justify-center bg-kk-background">
        1
      </span>
      <span className="flex items-center justify-center bg-kk-background">
        2
      </span>
      <span className="bg-kk-block" />
    </span>
  )
}
