import type { Page } from '@playwright/test'

import { DATA_URL } from '@/shared/bank/bank.constants'

const BANK_HEADERS = { 'access-control-allow-origin': '*' }

export async function refuseUndeclaredBanks(page: Page): Promise<string[]> {
  const refused: string[] = []
  await page.route(`${DATA_URL}/**`, async (route) => {
    refused.push(
      route
        .request()
        .url()
        .slice(DATA_URL.length + 1),
    )
    await route.fulfill({ status: 404, headers: BANK_HEADERS })
  })
  return refused
}

export async function serveBank({
  page,
  path,
  lines,
}: {
  page: Page
  path: string
  lines: string[]
}) {
  await page.route(`${DATA_URL}/${path}`, async (route) => {
    await route.fulfill({
      body: lines.map((line) => `${line}\n`).join(''),
      contentType: 'text/plain',
      headers: BANK_HEADERS,
    })
  })
}
