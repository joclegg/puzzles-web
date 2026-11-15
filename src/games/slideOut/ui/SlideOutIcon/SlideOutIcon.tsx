export function SlideOutIcon() {
  return (
    <span className="relative block size-11 rounded-md bg-so-board" aria-hidden>
      <span className="absolute top-[17px] left-[3px] h-[10px] w-[24px] rounded-[2px] bg-so-target" />
      <span className="absolute top-[3px] left-[29px] h-[24px] w-[11px] rounded-[2px] bg-so-block" />
      <span className="absolute top-[31px] left-[3px] h-[10px] w-[24px] rounded-[2px] bg-so-block" />
      <span className="absolute top-[17px] right-0 h-[10px] w-[2px] bg-so-exit" />
    </span>
  )
}
