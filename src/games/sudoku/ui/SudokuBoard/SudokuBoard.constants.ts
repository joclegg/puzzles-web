import { HIGHLIGHT } from '@/games/sudoku/engine/sudoku.constants'
import type { Highlight } from '@/games/sudoku/engine/sudoku.types'

export const GRID_COLUMNS_CLASS: Record<number, string> = {
  6: 'grid-cols-6',
  9: 'grid-cols-9',
}

export const NOTE_COLUMNS_CLASS: Record<number, string> = {
  6: 'grid-cols-3 grid-rows-2',
  9: 'grid-cols-3 grid-rows-3',
}

export const HIGHLIGHT_CLASS: Record<Highlight, string> = {
  [HIGHLIGHT.SELECTED]: 'bg-sd-selected',
  [HIGHLIGHT.SAME_DIGIT]: 'bg-sd-same-digit',
  [HIGHLIGHT.NOTE_MATCH]: 'bg-sd-peer',
  [HIGHLIGHT.PEER]: 'bg-sd-peer',
  [HIGHLIGHT.NONE]: '',
}

export const CAGE_SIDE_CLASS = {
  top: 'border-t',
  right: 'border-r',
  bottom: 'border-b',
  left: 'border-l',
}
