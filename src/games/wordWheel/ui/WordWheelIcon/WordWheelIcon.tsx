export function WordWheelIcon() {
  return (
    <span
      className="relative block size-11 rounded-full bg-ww-wheel text-[0.6rem] font-bold text-ww-letter-text"
      aria-hidden
    >
      <span className="absolute top-0.5 left-1/2 flex size-4 -translate-x-1/2 items-center justify-center rounded-full bg-ww-chosen text-ww-chosen-text">
        W
      </span>
      <span className="absolute bottom-1 left-1 flex size-4 items-center justify-center rounded-full bg-ww-letter">
        O
      </span>
      <span className="absolute right-1 bottom-1 flex size-4 items-center justify-center rounded-full bg-ww-letter">
        D
      </span>
    </span>
  )
}
