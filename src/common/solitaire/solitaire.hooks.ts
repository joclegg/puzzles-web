import { useEffect, useRef } from 'react'

import { epochDay } from '@/common/date.functions'
import { newSeed } from '@/common/random.functions'
import { GAME_ROUTE, SCREEN } from '@/common/route.constants'
import { navigate } from '@/common/route.hooks'
import {
  BUILD_ORDER,
  DAILY_SEED_SPREAD,
} from '@/common/solitaire/solitaire.constants'
import type {
  Board,
  BuildOrder,
  DrawMode,
} from '@/common/solitaire/solitaire.types'
import {
  DAILY_PREFIX,
  DEFAULT_SETTINGS,
  GAMES_KEY,
  SETTINGS_KEY,
} from '@/common/solitaire/solitaireSaves.constants'
import {
  finishDeal,
  startDeal,
} from '@/common/solitaire/solitaireSaves.functions'
import type {
  SavedDeal,
  SolitaireSettings,
  SolverReply,
  SolverRequest,
} from '@/common/solitaire/solitaireSaves.types'
import { encodeBoard } from '@/common/solitaire/solitaireCodec.functions'
import { readStored } from '@/common/storage.functions'
import { useStoredState } from '@/common/storage.hooks'

export function useSolitaireGames() {
  const [games, setGames] = useStoredState<SavedDeal[]>({
    key: GAMES_KEY,
    fallback: [],
  })
  const ask = useSolverWorker()

  function openGame(game: SavedDeal) {
    navigate([GAME_ROUTE.SOLITAIRE, SCREEN.GAME, game.id])
  }

  async function startAndOpen({
    dealId,
    seed,
  }: {
    dealId: string
    seed: bigint
  }) {
    const settings = readStored<SolitaireSettings>({
      key: SETTINGS_KEY,
      fallback: DEFAULT_SETTINGS,
    })
    const order: BuildOrder = settings.reverse
      ? BUILD_ORDER.UP
      : BUILD_ORDER.DOWN
    const reply = await ask({
      kind: 'deal',
      seed: String(seed),
      winnable: settings.winnableOnly,
      board: '',
      drawMode: settings.drawMode,
      order,
    })
    const started = startDeal({
      games: readStored<SavedDeal[]>({ key: GAMES_KEY, fallback: [] }),
      deal: { dealId, drawMode: settings.drawMode, order, board: reply.board },
      now: Date.now(),
    })
    setGames(() => started.games)
    openGame(started.game)
  }

  function startRandom() {
    const seed = newSeed()
    return startAndOpen({ dealId: `deal_${seed}`, seed })
  }

  function openDaily(date: string) {
    const dealId = `${DAILY_PREFIX}${date}`
    const existing = games.findLast((game) => game.dealId === dealId)
    if (existing) {
      openGame(existing)
      return Promise.resolve()
    }
    return startAndOpen({
      dealId,
      seed: BigInt(epochDay(date)) * DAILY_SEED_SPREAD,
    })
  }

  function saveProgress({
    id,
    patch,
  }: {
    id: number
    patch: Partial<SavedDeal>
  }) {
    setGames((all) =>
      all.map((game) => (game.id === id ? { ...game, ...patch } : game)),
    )
  }

  function finish({
    id,
    patch,
    won,
  }: {
    id: number
    patch: Partial<SavedDeal>
    won: boolean
  }): boolean {
    const result = finishDeal({
      games: games.map((game) =>
        game.id === id ? { ...game, ...patch } : game,
      ),
      id,
      won,
      now: Date.now(),
    })
    setGames(() => result.games)
    return result.newBest
  }

  function checkWinnable({
    board,
    drawMode,
    order,
  }: {
    board: Board
    drawMode: DrawMode
    order: BuildOrder
  }) {
    return ask({
      kind: 'check',
      seed: '0',
      winnable: false,
      board: encodeBoard(board),
      drawMode,
      order,
    })
  }

  return {
    games,
    openGame,
    startRandom,
    openDaily,
    saveProgress,
    finish,
    checkWinnable,
  }
}

function useSolverWorker() {
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef(new Map<number, (reply: SolverReply) => void>())
  const nextIdRef = useRef(0)

  useEffect(() => {
    const worker = new Worker(
      new URL('./solitaire.worker.ts', import.meta.url),
      {
        type: 'module',
      },
    )
    const pending = pendingRef.current
    worker.addEventListener('message', (event: MessageEvent<SolverReply>) => {
      pending.get(event.data.id)?.(event.data)
      pending.delete(event.data.id)
    })
    workerRef.current = worker
    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  return function ask(
    request: Omit<SolverRequest, 'id'>,
  ): Promise<SolverReply> {
    nextIdRef.current += 1
    const id = nextIdRef.current
    return new Promise((resolve) => {
      pendingRef.current.set(id, resolve)
      workerRef.current?.postMessage({ ...request, id })
    })
  }
}
