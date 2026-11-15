export function CrosswordIcon() {
  return (
    <span
      className="grid size-11 grid-cols-3 grid-rows-3 gap-px bg-cw-line p-px text-[0.65rem] leading-none font-semibold"
      aria-hidden
    >
      <span className="flex items-center justify-center bg-cw-background text-(--cw-accent)">
        A
      </span>
      <span className="bg-cw-background" />
      <span className="bg-cw-background" />
      <span className="bg-cw-block" />
      <span className="bg-cw-background" />
      <span className="bg-cw-block" />
      <span className="bg-cw-background" />
      <span className="bg-cw-background" />
      <span className="bg-cw-background" />
    </span>
  )
}
