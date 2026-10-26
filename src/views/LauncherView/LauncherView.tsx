import { GAME_ROUTE } from '@/common/route.constants'
import { routeHash } from '@/common/route.functions'
import { FiveLettersIcon } from '@/components/FiveLettersIcon/FiveLettersIcon'
import { GameCard } from '@/components/GameCard/GameCard'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'
import { TwoToneIcon } from '@/components/TwoToneIcon/TwoToneIcon'

export function LauncherView() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 py-6">
      <header className="flex items-center">
        <h1 className="flex-1 text-3xl font-semibold">Puzzles</h1>
        <ThemeToggle />
      </header>
      <GameCard
        title="Two Tone"
        detail="Fill the grid red and blue, three simple rules"
        href={routeHash([GAME_ROUTE.TWO_TONE])}
        icon={<TwoToneIcon />}
      />
      <GameCard
        title="Five Letters"
        detail="Guess the word in six tries, a new one every day"
        href={routeHash([GAME_ROUTE.FIVE_LETTERS])}
        icon={<FiveLettersIcon />}
      />
    </main>
  )
}
