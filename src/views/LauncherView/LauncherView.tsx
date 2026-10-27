import { GAME_ROUTE } from '@/common/route.constants'
import { routeHash } from '@/common/route.functions'
import { FiveLettersIcon } from '@/components/FiveLettersIcon/FiveLettersIcon'
import { KakuroIcon } from '@/components/KakuroIcon/KakuroIcon'
import { SlideOutIcon } from '@/components/SlideOutIcon/SlideOutIcon'
import { WordWheelIcon } from '@/components/WordWheelIcon/WordWheelIcon'
import { SolitaireIcon } from '@/components/SolitaireIcon/SolitaireIcon'
import { SudokuIcon } from '@/components/SudokuIcon/SudokuIcon'
import { GameCard } from '@/components/GameCard/GameCard'
import { SightlinesIcon } from '@/components/SightlinesIcon/SightlinesIcon'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { TwoToneIcon } from '@/components/TwoToneIcon/TwoToneIcon'

export function LauncherView() {
  return (
    <main className="mx-auto grid max-w-3xl gap-4 px-4 py-6 md:grid-cols-2">
      <header className="flex items-center md:col-span-2">
        <h1 className="flex-1 text-3xl font-semibold">Puzzles</h1>
        <ThemeToggle />
      </header>
      <GameCard
        title="Sudoku"
        detail="Classic and killer, from 6x6 to evil"
        href={routeHash([GAME_ROUTE.SUDOKU])}
        icon={<SudokuIcon />}
      />
      <GameCard
        title="Solitaire"
        detail="Klondike, draw 1 or 3, or reverse"
        href={routeHash([GAME_ROUTE.SOLITAIRE])}
        icon={<SolitaireIcon />}
      />
      <GameCard
        title="Two Tone"
        detail="Fill the grid red and blue, three simple rules"
        href={routeHash([GAME_ROUTE.TWO_TONE])}
        icon={<TwoToneIcon />}
      />
      <GameCard
        title="Sightlines"
        detail="Blue dots count what they can see"
        href={routeHash([GAME_ROUTE.SIGHTLINES])}
        icon={<SightlinesIcon />}
      />
      <GameCard
        title="Five Letters"
        detail="Guess the word in six tries, a new one every day"
        href={routeHash([GAME_ROUTE.FIVE_LETTERS])}
        icon={<FiveLettersIcon />}
      />
      <GameCard
        title="Kakuro"
        detail="Cross sums: runs of different digits that add up"
        href={routeHash([GAME_ROUTE.KAKURO])}
        icon={<KakuroIcon />}
      />
      <GameCard
        title="Slide Out"
        detail="Slide the blocks to free the red one"
        href={routeHash([GAME_ROUTE.SLIDE_OUT])}
        icon={<SlideOutIcon />}
      />
      <GameCard
        title="Word Wheel"
        detail="Swipe the letters to fill the crossword"
        href={routeHash([GAME_ROUTE.WORD_WHEEL])}
        icon={<WordWheelIcon />}
      />
    </main>
  )
}
