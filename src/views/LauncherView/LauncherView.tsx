import { Settings } from 'lucide-react'

import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { cn } from '@/common/utils.functions'
import {
  BUTTON_BASE_CLASS,
  BUTTON_SIZE,
  BUTTON_SIZE_CLASS,
  BUTTON_VARIANT,
  BUTTON_VARIANT_CLASS,
} from '@/components/Button/Button.constants'
import { routeHash } from '@/common/route.functions'
import type { SignInProvider } from '@/common/sync.types'
import { AccountButton } from '@/components/AccountButton/AccountButton'
import { FiveLettersIcon } from '@/components/FiveLettersIcon/FiveLettersIcon'
import { KakuroIcon } from '@/components/KakuroIcon/KakuroIcon'
import { SlideOutIcon } from '@/components/SlideOutIcon/SlideOutIcon'
import { WordWheelIcon } from '@/components/WordWheelIcon/WordWheelIcon'
import { SolitaireIcon } from '@/components/SolitaireIcon/SolitaireIcon'
import { SudokuIcon } from '@/components/SudokuIcon/SudokuIcon'
import { GameCard } from '@/components/GameCard/GameCard'
import { MENU_ACCENT } from '@/components/MenuScreen/MenuScreen.constants'
import { SightlinesIcon } from '@/components/SightlinesIcon/SightlinesIcon'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { TwoToneIcon } from '@/components/TwoToneIcon/TwoToneIcon'

export function LauncherView({
  email,
  onSignIn,
  onSendEmailLink,
  onVerifyEmailCode,
  onSignOut,
}: {
  email: string | null
  onSignIn: (provider: SignInProvider) => void
  onSendEmailLink: (email: string) => Promise<boolean>
  onVerifyEmailCode: (entry: {
    email: string
    code: string
  }) => Promise<boolean>
  onSignOut: () => void
}) {
  return (
    <main className="mx-auto grid max-w-3xl gap-4 px-4 py-6 md:grid-cols-2">
      <header className="flex items-center gap-2 md:col-span-2">
        <h1 className="flex-1 text-3xl font-semibold">Puzzles</h1>
        <AccountButton
          email={email}
          onSignIn={onSignIn}
          onSendEmailLink={onSendEmailLink}
          onVerifyEmailCode={onVerifyEmailCode}
          onSignOut={onSignOut}
        />
        <ThemeToggle />
        <a
          href={routeHash([GAME_ROUTE.SUDOKU, SCREEN.SETTINGS])}
          aria-label="Settings"
          className={cn(
            BUTTON_BASE_CLASS,
            BUTTON_VARIANT_CLASS[BUTTON_VARIANT.OUTLINE],
            BUTTON_SIZE_CLASS[BUTTON_SIZE.ICON],
          )}
        >
          <Settings />
        </a>
      </header>
      <GameCard
        title="Sudoku"
        detail="Classic and killer, from 6x6 to evil"
        href={routeHash([GAME_ROUTE.SUDOKU])}
        accent={MENU_ACCENT.SUDOKU}
        icon={<SudokuIcon />}
      />
      <GameCard
        title="Solitaire"
        detail="Klondike, draw 1 or 3, or reverse"
        href={routeHash([GAME_ROUTE.SOLITAIRE])}
        accent={MENU_ACCENT.SOLITAIRE}
        icon={<SolitaireIcon />}
      />
      <GameCard
        title="Two Tone"
        detail="Fill the grid red and blue, three simple rules"
        href={routeHash([GAME_ROUTE.TWO_TONE])}
        accent={MENU_ACCENT.TWO_TONE}
        icon={<TwoToneIcon />}
      />
      <GameCard
        title="Sightlines"
        detail="Blue dots count what they can see"
        href={routeHash([GAME_ROUTE.SIGHTLINES])}
        accent={MENU_ACCENT.SIGHTLINES}
        icon={<SightlinesIcon />}
      />
      <GameCard
        title="Five Letters"
        detail="Guess the word in six tries, a new one every day"
        href={routeHash([GAME_ROUTE.FIVE_LETTERS])}
        accent={MENU_ACCENT.FIVE_LETTERS}
        icon={<FiveLettersIcon />}
      />
      <GameCard
        title="Kakuro"
        detail="Cross sums: runs of different digits that add up"
        href={routeHash([GAME_ROUTE.KAKURO])}
        accent={MENU_ACCENT.KAKURO}
        icon={<KakuroIcon />}
      />
      <GameCard
        title="Slide Out"
        detail="Slide the blocks to free the red one"
        href={routeHash([GAME_ROUTE.SLIDE_OUT])}
        accent={MENU_ACCENT.SLIDE_OUT}
        icon={<SlideOutIcon />}
      />
      <GameCard
        title="Word Wheel"
        detail="Swipe the letters to fill the crossword"
        href={routeHash([GAME_ROUTE.WORD_WHEEL])}
        accent={MENU_ACCENT.WORD_WHEEL}
        icon={<WordWheelIcon />}
      />
    </main>
  )
}
