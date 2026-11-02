import { DEFINITION } from '@/games/solitaire/definition'
import {
  DRAW_MODE,
  DRAW_MODE_LABEL,
} from '@/games/solitaire/engine/solitaire.constants'
import { useSolitaireGames } from '@/games/solitaire/engine/solitaire.hooks'
import { DEAL_STATUS_LABEL } from '@/games/solitaire/engine/solitaireSaves.constants'
import { dealTitle } from '@/games/solitaire/engine/solitaireSaves.functions'
import { PuzzleHistoryView } from '@/shared/screens/PuzzleHistoryView/PuzzleHistoryView'

export function SolitaireHistoryView() {
  const { games } = useSolitaireGames()
  return (
    <PuzzleHistoryView
      definition={DEFINITION}
      games={games}
      options={{
        filterName: 'Draw mode',
        values: Object.values(DRAW_MODE),
        filterLabel: (mode) => DRAW_MODE_LABEL[mode],
        of: (game) => game.drawMode,
        title: dealTitle,
      }}
      detail={(game) =>
        `${DEAL_STATUS_LABEL[game.status]} · ${game.moveCount} moves`
      }
    />
  )
}
