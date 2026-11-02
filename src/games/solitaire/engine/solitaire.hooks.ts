import { useEffect, useRef } from 'react'

import { fetchBank } from '@/shared/bank/bank.hooks'
import { epochDay } from '@/shared/lib/date.functions'
import { newSeed } from '@/shared/lib/random.functions'
import { GAME_ROUTE, SCREEN } from '@/shared/lib/route.constants'
import { navigate } from '@/shared/lib/route.hooks'
import {
  BUILD_ORDER,
  DAILY_SEED_SPREAD,
} from '@/games/solitaire/engine/solitaire.constants'
import {
  dailyWinnableSeed,
  parseSeeds,
  randomWinnableSeed,
} from '@/games/solitaire/engine/solitaireBank.functions'
import { deal } from '@/games/solitaire/engine/solitaireBoard.functions'
import type {
  Board,
  BuildOrder,
  DrawMode,
} from '@/games/solitaire/engine/solitaire.types'
import {
  DAILY_PREFIX,
  DEFAULT_SETTINGS,
  GAMES_KEY,
  SETTINGS_KEY,
} from '@/games/solitaire/engine/solitaireSaves.constants'
import {
  finishDeal,
  startDeal,
} from '@/games/solitaire/engine/solitaireSaves.functions'
import type {
  SavedDeal,
  SolitaireSettings,
  SolverReply,
  SolverRequest,
} from '@/games/solitaire/engine/solitaireSaves.types'
import { encodeBoard } from '@/games/solitaire/engine/solitaireCodec.functions'
import { readStored } from '@/shared/storage/storage.functions'
import { useStoredState } from '@/shared/storage/storage.hooks'

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
    date,
  }: {
    dealId: string
    seed: bigint
    date: string | null
  }) {
    const settings = readStored<SolitaireSettings>({
      key: SETTINGS_KEY,
      fallback: DEFAULT_SETTINGS,
    })
    const order: BuildOrder = settings.reverse
      ? BUILD_ORDER.UP
      : BUILD_ORDER.DOWN
    const seeds = settings.winnableOnly
      ? parseSeeds(
          await fetchBank(`solitaire/${settings.drawMode}_${order}.txt`),
        )
      : []
    const dealSeed = !settings.winnableOnly
      ? seed
      : date === null
        ? randomWinnableSeed({ seeds, seed })
        : dailyWinnableSeed({ seeds, date })
    const started = startDeal({
      id: crypto.randomUUID(),
      games: readStored<SavedDeal[]>({ key: GAMES_KEY, fallback: [] }),
      deal: {
        dealId,
        drawMode: settings.drawMode,
        order,
        board: encodeBoard(deal(dealSeed)),
      },
      now: Date.now(),
    })
    setGames(() => started.games)
    openGame(started.game)
  }

  function startRandom() {
    const seed = newSeed()
    return startAndOpen({ dealId: `deal_${seed}`, seed, date: null })
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
      date,
    })
  }

  function saveProgress({
    id,
    patch,
  }: {
    id: string
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
    id: string
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
