import { describe, expect, it } from 'vitest'

import {
  clueLabel,
  createPuzzle,
  decodePuzzle,
  parseClues,
} from '@/games/crossword/engine/crosswordPuzzle.functions'

const SMALL =
  '11;SIDLE#FIFTHO#O#X#O#E#YBEE#AUSTEREE###M#T#L#NRATE#RETINA##W#J#R#N##PREFAB#UGLYL#L#B#H###OAFFABLE#WOKZ#T#E#R#A#EABHOR#BAGEL'

const MEDIUM =
  '13;TRY#WEARINESSR#O#H#B#N#M#OACUTELY#FRAUDN#R#N#S#O#N##SUSPENSE#CARPP###V###J#T#EINN#EERIE#ERRR#O#R###T###SEMIT#SUITABLE##S#M#T#I#E#VALIBI#ESSENCEM#L#N#R#O#C#RPHYSICIAN#HUE'

const LARGE =
  '15;LANDLOCKED#BOILO#I#O#L#A#S#S#UWRESTLING#UTTERB#C#S#E#L#B#R#IREEF#UNDERSTANDO###D#T###T#C#LWEBSITE#SHAKILY##R#S#L#I#N#S##REISSUE#DECIMALA#E#E###E#E###EINFINITELY#IDEAN#C#T#I#I#F#A#RBRAKE#MANNEQUINO#S#R#E#E#A#N#EWHEW#FRUSTRATED'

const SMALL_CLUES = parseClues(
  [
    'ABHOR;Loathe',
    'AFFABLE;Genial',
    'AUSTERE;Severe',
    'BAGEL;Ring-shaped roll',
    'BEE;Honey maker',
    'DOE;Female deer',
    'EXAM;Test',
    'FEELING;Sensation',
    'FIFTH;After fourth',
    'FOSTER;Nurture',
    'HERB;Thyme or sage',
    'HYENA;Laughing scavenger',
    'JABBER;Chatter',
    'PLAZA;Square',
    'PREFAB;Kit-built house',
    'RATE;Speed',
    'RETINA;Part of the eye',
    'SIDLE;Edge furtively',
    'SOBER;Not drunk',
    'TWELFTH;Ordinal after eleventh',
    'UGLY;Unsightly',
    'WAG;Joker',
    'WOK;Chinese pan',
    'YOKEL;Bumpkin',
  ].join('\n'),
)

describe('createPuzzle', () => {
  it('numbers the words in reading order, across then down', () => {
    const puzzle = createPuzzle({ size: 3, solution: [...'CATO#OWIP'] })

    expect(puzzle.words).toEqual([
      { number: 1, isAcross: true, cells: [0, 1, 2], answer: 'CAT' },
      { number: 3, isAcross: true, cells: [6, 7, 8], answer: 'WIP' },
      { number: 1, isAcross: false, cells: [0, 3, 6], answer: 'COW' },
      { number: 2, isAcross: false, cells: [2, 5, 8], answer: 'TOP' },
    ])
    expect([...puzzle.numbers]).toEqual([
      [0, 1],
      [2, 2],
      [6, 3],
    ])
  })
})

describe('decodePuzzle', () => {
  it.each([
    ['small', SMALL, 11],
    ['medium', MEDIUM, 13],
    ['large', LARGE, 15],
  ])('reads a %s grid', (_, line, size) => {
    const puzzle = decodePuzzle(line)

    expect(puzzle.size).toBe(size)
    expect(puzzle.solution).toHaveLength(size * size)
    expect(puzzle.words.every((word) => word.cells.length >= 2)).toBe(true)
  })

  it('finds a clue for every answer in a grid', () => {
    const answers = decodePuzzle(SMALL).words.map((word) => word.answer)

    expect(answers.filter((answer) => !SMALL_CLUES.has(answer))).toEqual([])
  })
})

describe('clueLabel', () => {
  it('adds the enumeration', () => {
    const puzzle = createPuzzle({ size: 3, solution: [...'CATO#OWIP'] })

    expect(
      clueLabel({
        clues: new Map([['CAT', 'Pet that purrs']]),
        word: puzzle.words[0],
      }),
    ).toBe('Pet that purrs (3)')
  })
})

describe('parseClues', () => {
  it('reads WORD;clue lines', () => {
    expect([...parseClues('ABACK;Taken ___, surprised\nCAT;A; pet\n')]).toEqual(
      [
        ['ABACK', 'Taken ___, surprised'],
        ['CAT', 'A; pet'],
      ],
    )
  })
})
