import answersText from '@data/words/answers.txt?raw'
import guessesText from '@data/words/guesses.txt?raw'
import { createWords } from '@/common/fiveLetters/fiveLetters.functions'

export const WORDS = createWords({
  answers: answersText.split('\n'),
  guesses: guessesText.split('\n'),
})

export const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

export const TITLE = 'Five Letters'
