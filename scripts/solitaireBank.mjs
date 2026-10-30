import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { runnerImport } from 'vite'

const [drawMode, order, countText] = process.argv.slice(2)
const count = Number(countText)
const root = path.resolve(import.meta.dirname, '..')
const file = path.join(
  root,
  process.env.PUZZLES_DATA ?? 'puzzles-data',
  'solitaire',
  `${drawMode}_${order}.txt`,
)
const config = { root, resolve: { alias: { '@': path.join(root, 'src') } } }
const { module: solver } = await runnerImport(
  '/src/common/solitaire/solitaireSolver.functions.ts',
  config,
)
const { module: random } = await runnerImport(
  '/src/common/random.functions.ts',
  config,
)

const found = new Set(
  existsSync(file)
    ? readFileSync(file, 'utf8')
        .split('\n')
        .filter((line) => line.length > 0)
    : [],
)
while (found.size < count) {
  const { seed } = solver.winnableDeal({
    seed: random.newSeed(),
    drawMode,
    order,
  })
  if (!found.has(String(seed))) {
    found.add(String(seed))
    appendFileSync(file, `${seed}\n`)
    console.log(`${drawMode} ${order}: ${found.size} of ${count}`)
  }
}
