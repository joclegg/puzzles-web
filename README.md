# Puzzles

Eight offline puzzle games for the browser, served at https://joclegg.github.io/puzzles-web/. The same games ship as the Android and iOS Puzzles apps, and all three behave alike.

- **Sudoku**: classic and killer, from a 6x6 Fast level to Evil, graded by the solving techniques a puzzle needs. Notes, undo and redo, mistake checking, a daily puzzle with medals, best times and history, and custom puzzle entry.
- **Solitaire**: Klondike, Draw 1 or Draw 3, with an optional reverse mode. One tap to move, unlimited undo, winnable deals, a daily deal, stats and history.
- **Two Tone**: fill the grid red and blue by three simple rules. Sizes 4 to 12, hints, a daily puzzle.
- **Sightlines**: blue dots count the dots they can see; red walls block the view. Sizes 4 to 9, hints, a daily puzzle.
- **Five Letters**: guess the five-letter word in six tries. Everyone gets the same word each day, so you can share your grid. Practice words, hard mode, stats.
- **Kakuro**: cross sums from 6x6 to 12x12, with notes, an optional sum helper and a daily puzzle per size.
- **Slide Out**: slide the blocks to free the red one. Beginner to Expert, graded by the fewest moves, with par, hints and undo.
- **Word Wheel**: swipe the letters on the wheel to fill a small crossword. Bonus words, shuffle and letter hints.

No ads, and no account needed: progress stays in your browser. Sign in with Google, Microsoft or email on the launcher to sync your games and settings with other browsers and the mobile apps. Puzzle banks load from [puzzles-data](https://github.com/joclegg/puzzles-data); the only other call out is Five Letters' Daily puzzle 2, which fetches that day's word from the Puzzles daily word service.

## How it's built

A single-page React app in strict TypeScript, built with Vite and styled with Tailwind CSS on Base UI primitives. The React Compiler handles memoisation. Each game lives in its own folder with its rules as pure functions and its screens as components, and is lazy-loaded from a game registry, so the launcher downloads only what it shows. Saves live in `localStorage`; optional sync goes through Supabase ([puzzles-backend](https://github.com/joclegg/puzzles-backend)). See [`AGENTS.md`](AGENTS.md) for the layout and the coding conventions.

## Develop

```sh
nvm use
npm ci
npm run dev
```

- `npm run lint`: ESLint, including the folder and naming rules
- `npm run format`: Prettier
- `npm run build`: type-check and build to `dist`
- `npm run data`: download the published puzzle banks into `puzzles-data/` for the tests

## Test

- `npm test`: Vitest unit tests for the pure functions
- `npm run test:e2e`: build, serve and run the Playwright view tests on desktop and mobile
- `npm run test:e2e:headed`: the same in a visible, slowed-down browser
- `npm run test:e2e:update`: regenerate the screenshot snapshots, only for intended visual changes

## Deploy

GitHub Actions builds and tests every pull request, and deploys `main` to GitHub Pages on each merge. New puzzles need no deploy: the app fetches the banks puzzles-data publishes.

## Credits

Word Wheel's word lists come from 12dicts by Alan Beale (public domain), with frequency data derived from AGID, Copyright 2000 by Kevin Atkinson. See [the notice](https://github.com/joclegg/puzzles-data/blob/main/wordwheel/NOTICE.md).
