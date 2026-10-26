import { cn } from '@/common/utils.functions'
import { SUITS } from '@/common/solitaire/solitaire.constants'
import type { Card } from '@/common/solitaire/solitaire.types'
import { RANK_LABEL } from '@/components/PlayingCard/PlayingCard.constants'

export function PlayingCard({
  card,
  faceUp,
  selected,
  label,
  onTap,
  className,
}: {
  card: Card | null
  faceUp: boolean
  selected: boolean
  label: string
  onTap: () => void
  className?: string
}) {
  const suit = card === null ? null : SUITS[card.suit]
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onTap}
      className={cn(
        'relative block aspect-[5/7] w-full rounded-md border border-sol-card-edge text-left shadow-sm',
        faceUp && card !== null
          ? 'bg-sol-card-face'
          : 'bg-sol-card-back bg-[repeating-linear-gradient(45deg,transparent_0_4px,var(--sol-card-back-pattern)_4px_5px)]',
        selected && 'ring-3 ring-sol-selected',
        className,
      )}
    >
      {faceUp && card !== null && suit !== null && (
        <span
          className={cn(
            'absolute top-0.5 left-1 flex flex-col text-[0.8rem] leading-none font-bold sm:text-base',
            suit.isRed ? 'text-sol-red-suit' : 'text-sol-black-suit',
          )}
        >
          <span>{RANK_LABEL[card.rank]}</span>
          <span>{suit.symbol}</span>
        </span>
      )}
    </button>
  )
}
