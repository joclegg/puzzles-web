import { describe, expect, it } from 'vitest'

import { trimSteps } from '@/shared/game/savedSteps.functions'

describe('trimSteps', () => {
  it('keeps the steps of the latest finished game in each group only', () => {
    const games = [
      game({ id: 'a', group: 'easy', finishedAt: 1 }),
      game({ id: 'b', group: 'easy', finishedAt: 3 }),
      game({ id: 'c', group: 'daily', finishedAt: 2 }),
      game({ id: 'd', group: 'daily', finishedAt: 4 }),
      game({ id: 'e', group: 'easy', status: 'inProgress', finishedAt: null }),
      game({ id: 'f', group: 'easy', status: 'abandoned', finishedAt: null }),
    ]

    const trimmed = trimSteps({
      games,
      groupOf: (saved) => saved.group,
      strip: (saved) => ({ ...saved, steps: '' }),
    })

    expect(trimmed.map((saved) => saved.steps)).toEqual([
      '',
      'a1 b2',
      '',
      'a1 b2',
      'a1 b2',
      '',
    ])
  })
})

function game({
  id,
  group,
  finishedAt,
  status = 'solved',
}: {
  id: string
  group: string
  finishedAt: number | null
  status?: string
}) {
  return { id, group, status, startedAt: 0, finishedAt, steps: 'a1 b2' }
}
