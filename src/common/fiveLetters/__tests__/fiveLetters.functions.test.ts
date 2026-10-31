import { describe, expect, it } from 'vitest'

import answersText from '@data/words/answers.txt?raw'
import guessesText from '@data/words/guesses.txt?raw'
import { addDays } from '@/common/date.functions'
import { MARK, REJECTION } from '@/common/fiveLetters/fiveLetters.constants'
import {
  createWords,
  dailyWord,
  dayNumber,
  hintLetter,
  isLost,
  isOver,
  isWon,
  letterMarks,
  newGame,
  daily2Word,
  randomWord,
  revealWord,
  score,
  shareText,
  submit,
  typeLetter,
} from '@/common/fiveLetters/fiveLetters.functions'
import type { FiveLettersGame } from '@/common/fiveLetters/fiveLetters.types'

const WORDS = createWords({
  answers: ['crane', 'slate', 'trace'],
  guesses: ['adieu', 'audio', 'crate', 'react', 'stale'],
})

const REAL_WORDS = createWords({
  answers: answersText.split('\n'),
  guesses: guessesText.split('\n'),
})

function enter({ game, word }: { game: FiveLettersGame; word: string }) {
  const typed = [...word].reduce(
    (state, letter) => typeLetter({ game: state, letter }),
    game,
  )
  return submit({ game: typed, words: WORDS })
}

describe('score', () => {
  it.each([
    ['CRANE', 'CRANE', 'CCCCC'],
    ['TRACE', 'CRANE', 'ACCPC'],
    ['SPEED', 'ABIDE', 'AAPAP'],
    ['EERIE', 'THEME', 'PAAAC'],
    ['LLAMA', 'HELLO', 'PPAAA'],
    ['ROBOT', 'FLOOR', 'PPACA'],
  ])(
    'marks repeated letters only as often as %s in %s',
    (guess, answer, expected) => {
      const marks = score({ guess, answer })

      expect(marks.map((mark) => mark[0].toUpperCase()).join('')).toBe(expected)
    },
  )
})

describe('submit', () => {
  it('turns a typed word into a guess and clears typing', () => {
    const after = enter({ game: newGame({ answer: 'CRANE' }), word: 'adieu' })

    expect([after.guesses, after.typing]).toEqual([['ADIEU'], ''])
  })

  it.each([
    ['cra', REJECTION.TOO_SHORT],
    ['zzzzz', REJECTION.NOT_A_WORD],
  ])('rejects %s and keeps it', (word, rejection) => {
    const after = enter({ game: newGame({ answer: 'CRANE' }), word })

    expect([after.guesses, after.typing, after.rejection]).toEqual([
      [],
      word.toUpperCase(),
      rejection,
    ])
  })

  it('rejects a hard mode guess that drops a green letter', () => {
    const game = enter({
      game: newGame({ answer: 'CRANE', hardMode: true }),
      word: 'crate',
    })

    const after = enter({ game, word: 'adieu' })

    expect(after.rejection).toBe(REJECTION.MUST_USE_HINTS)
  })

  it('accepts a hard mode guess that keeps every hint', () => {
    const game = enter({
      game: newGame({ answer: 'CRANE', hardMode: true }),
      word: 'react',
    })

    const after = enter({ game, word: 'trace' })

    expect(after.guesses).toHaveLength(2)
  })

  it('wins on the answer and ignores further typing', () => {
    const game = enter({
      game: enter({ game: newGame({ answer: 'CRANE' }), word: 'adieu' }),
      word: 'crane',
    })

    const after = typeLetter({ game, letter: 'a' })

    expect([isWon(after), after.typing]).toEqual([true, ''])
  })

  it('loses after six wrong guesses', () => {
    const after = Array.from({ length: 6 }).reduce<FiveLettersGame>(
      (state) => enter({ game: state, word: 'adieu' }),
      newGame({ answer: 'CRANE' }),
    )

    expect(isLost(after)).toBe(true)
  })
})

describe('shareText', () => {
  it('shows colours and no letters', () => {
    const game = enter({
      game: enter({ game: newGame({ answer: 'CRANE' }), word: 'trace' }),
      word: 'crane',
    })

    const text = shareText({ game, title: 'Five Letters 1' })

    expect(text).toBe('Five Letters 1 2/6\n\n⬜🟩🟩🟨🟩\n🟩🟩🟩🟩🟩')
  })
})

describe('letterMarks', () => {
  it('gives each letter its best mark', () => {
    const game = enter({
      game: enter({ game: newGame({ answer: 'CRANE' }), word: 'react' }),
      word: 'trace',
    })

    const marks = letterMarks(game)

    expect([marks.get('R'), marks.get('T')]).toEqual([
      MARK.CORRECT,
      MARK.ABSENT,
    ])
  })
})

describe('dailyWord', () => {
  it('picks a fixed word for each day', () => {
    const days = Array.from({ length: 10 }, (_, i) =>
      dailyWord({
        words: REAL_WORDS,
        date: addDays({ date: '2026-10-25', days: i }),
      }),
    )

    expect(days).toEqual([
      'TEMPO',
      'OZONE',
      'HEART',
      'STAFF',
      'QUEST',
      'SETUP',
      'SMART',
      'WITCH',
      'THANK',
      'DEPOT',
    ])
    expect(dailyWord({ words: REAL_WORDS, date: '2026-10-22' })).toBe('AGENT')
  })

  it('keeps every daily word when an answer is appended', () => {
    const appended = createWords({
      answers: [...answersText.split('\n'), 'zesty'],
      guesses: guessesText.split('\n'),
    })
    const dates = Array.from({ length: 944 }, (_, i) =>
      addDays({ date: '2026-10-25', days: i }),
    )

    expect(dates.map((date) => dailyWord({ words: appended, date }))).toEqual(
      dates.map((date) => dailyWord({ words: REAL_WORDS, date })),
    )
    expect(
      dailyWord({
        words: appended,
        date: addDays({ date: '2026-10-25', days: 944 }),
      }),
    ).toBe('ZESTY')
  })

  it('numbers the days from the first daily word', () => {
    expect(dayNumber('2026-11-01')).toBe(8)
  })
})

describe('randomWord', () => {
  it('picks a fixed practice word for each seed', () => {
    expect([
      randomWord({ words: REAL_WORDS, seed: 123456789012345n }),
      randomWord({ words: REAL_WORDS, seed: -7n }),
    ]).toEqual(['SHEEP', 'CROSS'])
  })
})

describe('daily2Word', () => {
  it('reads the word out of the daily word response', () => {
    expect(daily2Word({ date: '2026-10-31', word: 'yahoo' })).toBe('YAHOO')
  })

  it('ignores a response without a five-letter word', () => {
    expect([
      daily2Word({ word: 'toolong' }),
      daily2Word({ word: 'ab1de' }),
      daily2Word({ date: '2026-10-31' }),
      daily2Word(null),
    ]).toEqual([null, null, null, null])
  })
})

describe('an answer missing from the word list', () => {
  it('is accepted as a guess and wins', () => {
    const game = [...'GEEKY'].reduce(
      (state, letter) => typeLetter({ game: state, letter }),
      newGame({ answer: 'GEEKY' }),
    )

    expect(isWon(submit({ game, words: WORDS }))).toBe(true)
  })
})

describe('hintLetter', () => {
  it('gives the first letter not yet found in place', () => {
    const game = newGame({ answer: 'crane', guesses: ['cloud'] })

    expect(hintLetter(game)).toEqual({ index: 1, letter: 'r' })
  })
})

describe('revealWord', () => {
  it('ends the game as lost', () => {
    const game = revealWord(newGame({ answer: 'crane', guesses: ['cloud'] }))

    expect([isOver(game), isLost(game)]).toEqual([true, true])
  })
})
