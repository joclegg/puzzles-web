export function WordWheelIcon() {
  return (
    <span
      className="relative block size-11 rounded-full bg-ww-wheel text-[0.55rem] leading-none font-bold text-ww-chosen-text"
      aria-hidden
    >
      <span className="absolute top-[2px] left-[15px] flex size-3.5 items-center justify-center rounded-full bg-ww-chosen">
        W
      </span>
      <span className="absolute top-[15px] left-[28px] flex size-3.5 items-center justify-center rounded-full bg-ww-chosen">
        O
      </span>
      <span className="absolute top-[28px] left-[15px] flex size-3.5 items-center justify-center rounded-full bg-ww-chosen">
        R
      </span>
      <span className="absolute top-[15px] left-[2px] flex size-3.5 items-center justify-center rounded-full bg-ww-chosen">
        D
      </span>
    </span>
  )
}
