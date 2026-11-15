export function SolitaireIcon() {
  return (
    <span
      className="relative block size-11 text-[0.6rem] leading-none font-bold"
      aria-hidden
    >
      <span className="absolute top-0.5 left-0.5 flex h-[38px] w-[27px] flex-col items-start rounded-sm border border-sol-card-edge bg-sol-card-face p-0.5 text-sol-black-suit">
        <span>K</span>
        <span>♠</span>
      </span>
      <span className="absolute top-[5px] left-4 flex h-[38px] w-[27px] flex-col items-start rounded-sm border border-sol-card-edge bg-sol-card-face p-0.5 text-sol-red-suit">
        <span>A</span>
        <span className="mt-0.5 self-center text-base">♥</span>
      </span>
    </span>
  )
}
