import { formatDuration } from '@/shared/lib/format.functions'
import { GAME_ROUTE } from '@/shared/lib/route.constants'
import {
  DRAW_MODE,
  DRAW_MODE_LABEL,
} from '@/games/solitaire/engine/solitaire.constants'
import { useSolitaireGames } from '@/games/solitaire/engine/solitaire.hooks'
import { drawStats } from '@/games/solitaire/engine/solitaireSaves.functions'
import { MenuScreen } from '@/shared/screens/MenuScreen/MenuScreen'
import { MENU_ACCENT } from '@/shared/screens/MenuScreen/MenuScreen.constants'
import { Panel } from '@/shared/screens/Panel/Panel'
import { ScreenHeader } from '@/shared/ui/ScreenHeader/ScreenHeader'

export function SolitaireStatsView() {
  const { games } = useSolitaireGames()
  const stats = drawStats({ games, modes: Object.values(DRAW_MODE) })

  return (
    <MenuScreen accent={MENU_ACCENT.SOLITAIRE}>
      <ScreenHeader title="Stats" back={[GAME_ROUTE.SOLITAIRE]} />
      {stats.map((mode) => (
        <Panel key={mode.drawMode} title={DRAW_MODE_LABEL[mode.drawMode]}>
          <dl className="grid grid-cols-2 gap-y-1 text-sm">
            <dt>Played</dt>
            <dd className="text-right">{mode.played}</dd>
            <dt>Won</dt>
            <dd className="text-right">{mode.won}</dd>
            <dt>Win rate</dt>
            <dd className="text-right">
              {mode.played === 0
                ? '–'
                : `${Math.floor((mode.won * 100) / mode.played)}%`}
            </dd>
            <dt>Best time</dt>
            <dd className="text-right">
              {mode.bestMs === null ? '–' : formatDuration(mode.bestMs)}
            </dd>
            <dt>Average time</dt>
            <dd className="text-right">
              {mode.averageMs === null ? '–' : formatDuration(mode.averageMs)}
            </dd>
            <dt>Fewest moves</dt>
            <dd className="text-right">{mode.fewestMoves ?? '–'}</dd>
          </dl>
        </Panel>
      ))}
      <p className="text-sm text-muted-foreground">
        Abandoned deals count as played. Daily deals count under the draw mode
        they were played with.
      </p>
    </MenuScreen>
  )
}
