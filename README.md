# Puzzles

Eight offline puzzle games for the browser, served at https://joclegg.github.io/puzzles-web/.

- **Sudoku**: classic and killer, from a 6x6 Fast level to Evil, graded by the solving techniques a puzzle needs. Notes, undo and redo, mistake checking, a daily puzzle with medals, best times and history, and custom puzzle entry.
- **Solitaire**: Klondike, Draw 1 or Draw 3, with an optional reverse mode. One tap to move, unlimited undo, winnable deals, a daily deal, stats and history.
- **Two Tone**: fill the grid red and blue by three simple rules. Sizes 4 to 12, hints, a daily puzzle.
- **Sightlines**: blue dots count the dots they can see; red walls block the view. Sizes 4 to 9, hints, a daily puzzle.
- **Five Letters**: guess the five-letter word in six tries. Everyone gets the same word each day, so you can share your grid. Practice words, hard mode, stats.
- **Kakuro**: cross sums from 6x6 to 12x12, with notes, an optional sum helper and a daily puzzle per size.
- **Slide Out**: slide the blocks to free the red one. Beginner to Expert, graded by the fewest moves, with par, hints and undo.
- **Word Wheel**: swipe the letters on the wheel to fill a small crossword. Bonus words, shuffle and letter hints.

No ads, and no account needed: progress stays in your browser. Sign in with Google or Microsoft on the launcher to sync your games and settings with other browsers and the Android app. The only other call out is Five Letters' NY Times daily, which fetches that day's Wordle answer.

See [`AGENTS.md`](AGENTS.md) for commands and coding rules.

## Setup

```sh
nvm use
npm install
npm run dev
```

## Credits

Word Wheel's word lists come from 12dicts by Alan Beale (public domain), with frequency data derived from AGID, Copyright 2000 by Kevin Atkinson. See `puzzles-data/wordwheel/NOTICE.md`.
