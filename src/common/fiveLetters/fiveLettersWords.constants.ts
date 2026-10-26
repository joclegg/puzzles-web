import answersText from '@/assets/words/answers.txt?raw'
import guessesText from '@/assets/words/guesses.txt?raw'
import { createWords } from '@/common/fiveLetters/fiveLetters.functions'

export const WORDS = createWords({
  answers: answersText.split('\n'),
  guesses: guessesText.split('\n'),
})

export const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

export const TITLE = 'Five Letters'
