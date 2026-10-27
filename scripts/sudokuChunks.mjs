import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

const CHUNK_SIZE = 250
const root = path.resolve(import.meta.dirname, '..')
const source = path.join(root, 'puzzles-data', 'sudoku')
const target = path.join(root, 'public', 'sudoku')

rmSync(target, { recursive: true, force: true })
for (const file of readdirSync(source).filter((it) => it.endsWith('.txt'))) {
  const lines = readFileSync(path.join(source, file), 'utf8')
    .split('\n')
    .filter((line) => line.length > 0)
  const dir = path.join(target, path.basename(file, '.txt'))
  mkdirSync(dir, { recursive: true })
  for (let start = 0; start < lines.length; start += CHUNK_SIZE) {
    writeFileSync(
      path.join(dir, `${start / CHUNK_SIZE}.txt`),
      `${lines.slice(start, start + CHUNK_SIZE).join('\n')}\n`,
    )
  }
}
