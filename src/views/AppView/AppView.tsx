import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { useRoute } from '@/common/route.hooks'
import { FiveLettersView } from '@/views/FiveLettersView/FiveLettersView'
import { KakuroView } from '@/views/KakuroView/KakuroView'
import { LauncherView } from '@/views/LauncherView/LauncherView'
import { SlideOutView } from '@/views/SlideOutView/SlideOutView'
import { SolitaireView } from '@/views/SolitaireView/SolitaireView'
import { SightlinesView } from '@/views/SightlinesView/SightlinesView'
import { SudokuView } from '@/views/SudokuView/SudokuView'
import { TwoToneView } from '@/views/TwoToneView/TwoToneView'
import { WordWheelView } from '@/views/WordWheelView/WordWheelView'

export function AppView() {
  const [game, screen = SCREEN.HOME, id = ''] = useRoute()

  if (game === GAME_ROUTE.FIVE_LETTERS) {
    return <FiveLettersView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.TWO_TONE) {
    return <TwoToneView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SIGHTLINES) {
    return <SightlinesView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.KAKURO) {
    return <KakuroView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SLIDE_OUT) {
    return <SlideOutView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.WORD_WHEEL) {
    return <WordWheelView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SOLITAIRE) {
    return <SolitaireView screen={screen} id={id} />
  }
  if (game === GAME_ROUTE.SUDOKU) {
    return <SudokuView screen={screen} id={id} />
  }
  return <LauncherView />
}
