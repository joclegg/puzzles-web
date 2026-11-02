export function SlideOutIcon() {
  return (
    <span
      className="grid size-11 grid-cols-3 grid-rows-3 gap-0.5 rounded-md bg-so-board p-0.5"
      aria-hidden
    >
      <span className="col-span-1 row-span-2 rounded-sm bg-so-block" />
      <span className="col-span-2 rounded-sm bg-so-block" />
      <span className="col-span-2 col-start-2 row-start-2 rounded-sm bg-so-target" />
      <span className="col-span-3 row-start-3 rounded-sm bg-so-block" />
    </span>
  )
}
