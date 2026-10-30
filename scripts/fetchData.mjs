import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const DATA_URL = 'https://joclegg.github.io/puzzles-data'
const root = path.resolve(import.meta.dirname, '..')
const target = path.join(root, 'puzzles-data')

const manifest = await fetchOk('manifest.json').then((it) => it.json())
await Promise.all(
  Object.entries(manifest.files).map(async ([file, { sha256 }]) => {
    const local = path.join(target, file)
    if (existsSync(local) && hash(readFileSync(local)) === sha256) return
    const bytes = Buffer.from(await (await fetchOk(file)).arrayBuffer())
    mkdirSync(path.dirname(local), { recursive: true })
    writeFileSync(local, bytes)
  }),
)

async function fetchOk(file) {
  const response = await fetch(`${DATA_URL}/${file}`)
  if (!response.ok) throw new Error(`Could not download ${file}`)
  return response
}

function hash(bytes) {
  return createHash('sha256').update(bytes).digest('hex')
}
