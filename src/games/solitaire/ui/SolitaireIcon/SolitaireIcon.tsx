export function SolitaireIcon() {
  return (
    <span className="relative block h-11 w-12" aria-hidden>
      <span className="absolute top-1 left-0 h-9 w-7 -rotate-12 rounded-sm border border-sol-card-edge bg-sol-card-face text-[0.6rem] font-bold text-sol-black-suit">
        A♠
      </span>
      <span className="absolute top-0 left-4 h-9 w-7 rotate-6 rounded-sm border border-sol-card-edge bg-sol-card-face text-[0.6rem] font-bold text-sol-red-suit">
        K♥
      </span>
    </span>
  )
}
