export function SudokuIcon() {
  return (
    <span
      className="grid size-11 grid-cols-3 grid-rows-3 border-2 border-sd-thick bg-sd-background text-[0.6rem] font-bold text-sd-digit"
      aria-hidden
    >
      {['5', '', '3', '', '7', '', '1', '', '9'].map((digit, i) => (
        <span
          key={i}
          className="flex items-center justify-center border border-sd-thin"
        >
          {digit}
        </span>
      ))}
    </span>
  )
}
