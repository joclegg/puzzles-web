import { VERDICT } from '@/games/solitaire/engine/solitaire.constants'
import type { SolverRequest } from '@/games/solitaire/engine/solitaireSaves.types'
import { decodeBoard } from '@/games/solitaire/engine/solitaireCodec.functions'
import { solve } from '@/games/solitaire/engine/solitaireSolver.functions'

const CHECK_LIMIT_MS = 3000

self.addEventListener('message', (event: MessageEvent<SolverRequest>) => {
  const request = event.data
  const started = performance.now()
  const verdict = solve({
    start: decodeBoard(request.board),
    drawMode: request.drawMode,
    order: request.order,
    shouldStop: () => performance.now() - started > CHECK_LIMIT_MS,
  })
  self.postMessage({
    id: request.id,
    board: request.board,
    verdict: verdict === VERDICT.UNKNOWN ? null : verdict,
  })
})
