import { History, Settings, Trophy } from 'lucide-react'

import { todayIso } from '@/shared/lib/date.functions'
import { GAME_ROUTE, LAUNCHER_ROUTE } from '@/shared/lib/route.constants'
import { cn } from '@/shared/lib/utils.functions'
import {
  BUTTON_BASE_CLASS,
  BUTTON_SIZE,
  BUTTON_SIZE_CLASS,
  BUTTON_VARIANT,
  BUTTON_VARIANT_CLASS,
} from '@/shared/ui/Button/Button.constants'
import { routeHash } from '@/shared/lib/route.functions'
import type { SignInProvider } from '@/shared/sync/sync.types'
import {
  hasAllGolds,
  todayMedals,
} from '@/shared/game/AllGames/AllGames.functions'
import { useAllSaves } from '@/shared/game/AllGames/AllGames.hooks'
import { AccountButton } from '@/shared/sync/AccountButton/AccountButton'
import { FiveLettersIcon } from '@/games/fiveLetters/ui/FiveLettersIcon/FiveLettersIcon'
import { KakuroIcon } from '@/games/kakuro/ui/KakuroIcon/KakuroIcon'
import { SlideOutIcon } from '@/games/slideOut/ui/SlideOutIcon/SlideOutIcon'
import { WordWheelIcon } from '@/games/wordWheel/ui/WordWheelIcon/WordWheelIcon'
import { SolitaireIcon } from '@/games/solitaire/ui/SolitaireIcon/SolitaireIcon'
import { SudokuIcon } from '@/games/sudoku/ui/SudokuIcon/SudokuIcon'
import { GameCard } from '@/app/GameCard/GameCard'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { SightlinesIcon } from '@/games/sightlines/ui/SightlinesIcon/SightlinesIcon'
import { ThemeToggle } from '@/shared/ui/ThemeToggle/ThemeToggle'
import { TwoToneIcon } from '@/games/twoTone/ui/TwoToneIcon/TwoToneIcon'

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
  const medals = todayMedals({
    saves: useAllSaves(),
    today: todayIso(),
    dayOf: (ms) => todayIso(new Date(ms)),
  })
  return (
    <main className="mx-auto grid max-w-3xl gap-4 px-4 py-6 md:grid-cols-2">
      <header className="flex items-center gap-2 md:col-span-2">
        <h1 className="flex flex-1 items-center gap-2 text-3xl font-semibold">
          Puzzles
          {hasAllGolds(medals) && (
            <Trophy
              role="img"
              aria-label="Gold in every puzzle"
              className="size-7 text-sd-gold"
            />
          )}
        </h1>
        <AccountButton
          email={email}
          onSignIn={onSignIn}
          onSendEmailLink={onSendEmailLink}
          onVerifyEmailCode={onVerifyEmailCode}
          onSignOut={onSignOut}
        />
        <ThemeToggle />
        <a
          href={routeHash([LAUNCHER_ROUTE.HISTORY])}
          aria-label="History"
          className={cn(
            BUTTON_BASE_CLASS,
            BUTTON_VARIANT_CLASS[BUTTON_VARIANT.OUTLINE],
            BUTTON_SIZE_CLASS[BUTTON_SIZE.ICON],
          )}
        >
          <History />
        </a>
        <a
          href={routeHash([LAUNCHER_ROUTE.SETTINGS])}
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
        medal={medals[GAME_ROUTE.SUDOKU]}
        icon={<SudokuIcon />}
      />
      <GameCard
        title="Solitaire"
        detail="Klondike, draw 1 or 3, or reverse"
        href={routeHash([GAME_ROUTE.SOLITAIRE])}
        accent={MENU_ACCENT.SOLITAIRE}
        medal={medals[GAME_ROUTE.SOLITAIRE]}
        icon={<SolitaireIcon />}
      />
      <GameCard
        title="Two Tone"
        detail="Fill the grid red and blue, three simple rules"
        href={routeHash([GAME_ROUTE.TWO_TONE])}
        accent={MENU_ACCENT.TWO_TONE}
        medal={medals[GAME_ROUTE.TWO_TONE]}
        icon={<TwoToneIcon />}
      />
      <GameCard
        title="Sightlines"
        detail="Blue dots count what they can see"
        href={routeHash([GAME_ROUTE.SIGHTLINES])}
        accent={MENU_ACCENT.SIGHTLINES}
        medal={medals[GAME_ROUTE.SIGHTLINES]}
        icon={<SightlinesIcon />}
      />
      <GameCard
        title="Five Letters"
        detail="Guess the word in six tries, a new one every day"
        href={routeHash([GAME_ROUTE.FIVE_LETTERS])}
        accent={MENU_ACCENT.FIVE_LETTERS}
        medal={medals[GAME_ROUTE.FIVE_LETTERS]}
        icon={<FiveLettersIcon />}
      />
      <GameCard
        title="Kakuro"
        detail="Cross sums: runs of different digits that add up"
        href={routeHash([GAME_ROUTE.KAKURO])}
        accent={MENU_ACCENT.KAKURO}
        medal={medals[GAME_ROUTE.KAKURO]}
        icon={<KakuroIcon />}
      />
      <GameCard
        title="Slide Out"
        detail="Slide the blocks to free the red one"
        href={routeHash([GAME_ROUTE.SLIDE_OUT])}
        accent={MENU_ACCENT.SLIDE_OUT}
        medal={medals[GAME_ROUTE.SLIDE_OUT]}
        icon={<SlideOutIcon />}
      />
      <GameCard
        title="Word Wheel"
        detail="Swipe the letters to fill the crossword"
        href={routeHash([GAME_ROUTE.WORD_WHEEL])}
        accent={MENU_ACCENT.WORD_WHEEL}
        medal={medals[GAME_ROUTE.WORD_WHEEL]}
        icon={<WordWheelIcon />}
      />
    </main>
  )
}
