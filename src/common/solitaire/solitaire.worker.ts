import { VERDICT } from '@/common/solitaire/solitaire.constants'
import type { SolverRequest } from '@/common/solitaire/solitaireSaves.types'
import { deal } from '@/common/solitaire/solitaireBoard.functions'
import {
  decodeBoard,
  encodeBoard,
} from '@/common/solitaire/solitaireCodec.functions'
import {
  solve,
  winnableDeal,
} from '@/common/solitaire/solitaireSolver.functions'

const CHECK_LIMIT_MS = 3000

self.addEventListener('message', (event: MessageEvent<SolverRequest>) => {
  const request = event.data
  if (request.kind === 'deal') {
    const seed = BigInt(request.seed)
    const board = request.winnable
      ? winnableDeal({ seed, drawMode: request.drawMode, order: request.order })
          .board
      : deal(seed)
    self.postMessage({
      id: request.id,
      board: encodeBoard(board),
      verdict: null,
    })
    return
  }
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
