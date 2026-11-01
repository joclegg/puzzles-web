# AGENTS.md

## Structure

Puzzles for the web: eight offline puzzle games (Sudoku, Solitaire, Two Tone, Sightlines, Five Letters, Kakuro, Slide Out and Word Wheel) served at https://joclegg.github.io/puzzles-web/. Vite, React with the React Compiler, strict TypeScript, Tailwind CSS on Base UI, Vitest, Playwright, ESLint and Prettier. `README.md` lists the npm scripts.

- `src/main.tsx`: entry point. `src/index.css`: Tailwind, the theme tokens and each game's colours (`--<prefix>-accent` and friends, each with a dark value).
- `src/app/`: the shell. `AppView` is the hash router: it finds the game for `#/<game>/<screen>/<id>` in the registry and renders that game's lazy `View`. Also `LauncherView` (the game picker), `GameCard`, `GeneralSettingsView` (`#/settings`: theme and account) and `AllHistoryView`.
- `src/games/games.constants.ts`: `GAMES`, the registry of every game's `GameDefinition`, in launcher order.
- `src/games/<game>/`: everything one game owns, in the same shape for every game:
  - `definition.ts`: its `GameDefinition` (id, name, accent, bank paths, screens and the lazy `View`).
  - `engine/`: every rule as pure functions on the game's state, with its types, constants, saves, settings and its `use<Game>Games` hook, e.g. `src/games/kakuro/engine/kakuro.functions.ts`. Slow searches run in a `.worker.ts` here, such as the Solitaire solver. Unit tests in `engine/__tests__/`.
  - `ui/`: its components, one folder each: `<Game>View` (picks the screen), `<Game>GameView` (the board), `<Game>SettingsView`, `<Game>Icon`, the board pieces, and any screen not yet shared. Playwright tests sit in `ui/<View>/__e2e__/`.
- `src/shared/`: code used by more than one game:
  - `game/`: what every game plays with: the `GameDefinition` and `PuzzleOptions` types, saved-puzzle helpers (`puzzleSaves.*`), the timer and `usePuzzleGame`, daily medals (`medalFor`), assists, and the play-screen components (`WinDialog`, `RevealDialog`, `GameNotFound`, `GameStatusBar`, `HowToPlay`, `Walkthrough`, `NumberPad`). `AllGames/` reads every game's saves for the launcher, the all-games history and the all-golds banner.
  - `screens/`: the shared menu screens: `HomeScreen`, `PuzzleHomeView`, `PuzzleStatsView`, `PuzzleHistoryView`, `PuzzleDailyView`, `DailyCalendar`, `SettingsScreen` (a General tab, then a tab per game at `#/<game>/settings`), and their pieces (`MenuScreen`, `GameHero`, `ContinueCard`, `MenuSection`, `MenuTile`, `DailyTile`, `LevelDots`, `Panel`, `FilterChip`, `EmptyState` and so on). `MenuScreen` sets the game's accent as `--game`, used as `bg-game`, `ring-game` and `text-game`.
  - `bank/`: `fetchBank` and `useBank` load and cache the puzzle banks from https://joclegg.github.io/puzzles-data/, and `BankLoader` shows their progress. Banks are not bundled, so new puzzles need no rebuild; change them in [joclegg/puzzles-data](https://github.com/joclegg/puzzles-data).
  - `storage/`: `readStored`, `writeStored` and `useStoredState` over `localStorage`, and `legacySettings`, which tidies keys left by older versions on start-up.
  - `sync/`: optional sign-in (Google, Microsoft, or an emailed link with a code) and sync with the Supabase project in [joclegg/puzzles-backend](https://github.com/joclegg/puzzles-backend). `writeStored` stamps each change to a synced key and queues it in `sync.pending`; `useSync` (in `AppView`) pushes the queue to `saved_games` and `game_settings`, then pulls rows changed since the last pull by the server's `synced_at`, a page at a time, last write wins. It syncs on sign-in, after each change, when the tab becomes visible and when the browser comes online, and retries after a failure. Pulled changes fire `puzzles:synced` with the changed keys, and `useStoredState` re-reads only those. Signing out queues every stamped key again, so the next sign-in uploads everything in this browser. The merge and push logic is pure, in `sync.functions.ts`; `sync.hooks.ts` does only the I/O. Also the account UI (`AccountButton`, `SignInDialog`, `DeleteAccount`, `ProviderButton` and the brand logos).
  - `lib/`: random numbers (`createRandom`, XorWow), dates, formatting, the `cn` class helper and routing (`GAME_ROUTE`, `SCREEN`, `navigate`).
  - `ui/`: generic primitives: `Button`, `AppDialog`, `MoreMenu`, `OptionGroup`, `ScreenHeader`, `BackButton`, `ThemePicker` and `ThemeToggle`.
- Synced data: `<game>.games` (an array of saves, each with a uuid `id`) and `<game>.settings`, shared with puzzles-android and puzzles-ios. Sudoku keeps the helpers (`showHints`, `allowReveal`, `showTutorial`, `hintStyle`) in both `classic` and `killer`, and also writes Classic's values at the top level for older app versions; `fromStoredSettings` reads each mode's own value, falling back to the top level, and `toStoredSettings` writes both.
- `__tests__/`: Vitest unit tests, beside the files they test. `src/assets/`: data used only by tests, such as `sudoku-samples/`.
- `e2e/`: shared Playwright code: `playwrightExtensions.ts` (the `test` fixture, which pins the clock and serves bank requests from `puzzles-data/`) and one page object class per view or game, e.g. `launcherPage.ts`, `fiveLettersPage.ts`.
- `puzzles-data/`: a gitignored copy of the published banks, downloaded by `scripts/fetchData.mjs` (`npm run data`, which runs before the unit and e2e tests). Tests import them with the `@data/` alias, e.g. `@data/slideout/easy.txt?raw`.
- `scripts/solitaireBank.mjs`: appends winnable Solitaire deal seeds to `solitaire/<drawMode>_<order>.txt` in a puzzles-data clone, e.g. `PUZZLES_DATA=../puzzles-data node scripts/solitaireBank.mjs drawThree down 1000`. Winnable deals come only from that bank (a random line, or the day's line for the daily deal), so starting a game never runs the solver.
- `public/`: the favicons, `apple-touch-icon.png` and `manifest.webmanifest` with its icons, drawn from the Android launcher icon.

## Conventions

Rules marked (lint) are enforced by `npm run lint`.

### General

- MUST keep `npm run lint`, `npm test`, `npm run test:e2e` and `npm run build` passing.
- MUST format code with Prettier.
- MUST import from `src` using the `@/` alias (lint), and from `e2e` using the `@e2e/` alias.
- MUST NOT write comments. (lint)
- MUST NOT replace the `typescript` package (the TypeScript 6 API, kept only for typescript-eslint; `tsc` is TypeScript 7) until typescript-eslint supports TypeScript 7.
- MUST keep the eight games behaving the same as in puzzles-android and puzzles-ios.
- MUST NOT change `localStorage` keys, saved data formats, sync payloads, routes or `data-testid` values without the same change in the other apps.

### Files

- MUST put code only in `src/app/`, `src/shared/<bank|game|lib|screens|storage|sync|ui>/` or `src/games/<game>/`, plus `src/main.tsx`. (lint)
- MUST give every game the same shape: `src/games/<game>/definition.ts`, `engine/` and `ui/`. (lint)
- MUST define exactly one `GameDefinition` per game, in its `definition.ts`, and register it in `GAMES` in `src/games/games.constants.ts`.
- MUST put each component in its own PascalCase folder holding all of its files, named after the folder, e.g. `ThemeToggle/ThemeToggle.hooks.ts`. (lint)
- MUST name every other file in camelCase, e.g. `random.types.ts`, optionally in a camelCase subfolder. (lint)
- MUST split code by kind using file suffixes: `.tsx` for the component, then `.types.ts`, `.constants.ts`, `.functions.ts` and `.hooks.ts`. (lint)
- MUST put a Web Worker, used only for slow searches such as the Solitaire solver, in a `.worker.ts` file in the game's `engine/`. (lint)
- MUST define exactly one component per file. (lint)
- MUST NOT define components inside other components. (lint)
- MUST put code used by more than one game in `src/shared/`, and use a shared screen instead of adding a per-game copy.
- MUST NOT leave dead code: delete unused files, exports and dependencies (`npx knip` lists them).
- MUST list build-only packages in `devDependencies`.

### Games

- MUST keep every game playable offline and signed out, with no analytics or ads. Every asset except the puzzle banks MUST ship with the build.
- MUST keep sign-in optional, with Google, Microsoft (Supabase's `azure` provider, which needs the `email` scope) or email (a magic link that only works in the same browser, plus a code for anywhere else), used only to sync saves and settings through `src/shared/sync/`.
- MUST follow each brand's sign-in button guidelines for the Google and Microsoft buttons, with Roboto bundled for Google.
- MUST load puzzle banks only from the puzzles-data site, through `src/shared/bank/`.
- MUST NOT call any other site, except for the Five Letters **Daily puzzle 2**: a separate game (id `daily2_<date>`; older saves with the legacy prefix in `LEGACY_DAILY2_PREFIX` read as the same game) next to the Puzzles daily, which fetches the day's word from our Cloudflare Worker, `GET https://puzzles-daily.joclegg.dev/word/<yyyy-mm-dd>` (JSON `{"date","word"}`, CORS `*`).
- MUST say so when the Daily puzzle 2 fetch fails, and MUST NOT let it replace the Puzzles daily.
- MUST keep all player data in the browser, in `localStorage`, through `useStoredState` and `readStored`/`writeStored`, under keys prefixed with the game, e.g. `fiveLetters.games`.
- MUST sync only `<game>.games` and `<game>.settings` when signed in; every other key stays local.
- MUST give each new save a uuid `id` from `crypto.randomUUID()`, passed into the game's start function, so saves from different devices never clash.
- MUST put every game rule in `src/games/<game>/engine/` as a pure function on that game's state. Components MUST only wire state to those functions.
- MUST NOT import one game's `src/games/<game>/` code from another game.
- MUST draw every random number from `createRandom` in `src/shared/lib/random.functions.ts` (XorWow), never `Math.random`, so seeded puzzles are reproducible.
- MUST pick daily puzzles locally and deterministically from the date, so everyone gets the same daily puzzle.
- MUST give each game a `DailyCalendar` screen (`SCREEN.DAILY`) and a `DailyCalendarButton` in its Home header, coloured by today's medal.
- MUST use `medalFor` as the only medal rule: bronze for one daily on the day, silver for more than one, gold for all. Five Letters starts at silver (two dailies), and Solitaire has one daily, so it is gold or nothing.
- MUST give every screen except the launcher a back button at the top left.
- MUST put a Settings item in every game's ⋮ menu.
- MUST define each game's colours as CSS variables in `src/index.css`, with a dark value for every token.

### Ordering

- MUST order declarations in a file: exported before non-exported, then `const`s, then types and interfaces, then functions, then alphabetically within each group. (lint, except `const`s)
- MUST put module-level `const`s at the top, below the imports, because they are not hoisted.

### TypeScript

- MUST keep TypeScript in strict mode.
- MUST NOT use `any`. (lint)
- MUST NOT use `@ts-ignore`.
- MUST define parameter and prop types inline and destructure them, e.g. `function clampSlide({ index, count }: { index: number; count: number })`.
- MUST use an `interface` only when the shape is shared by more than one file, and put it in a `.types.ts` file.
- MUST NOT use `type` aliases for object shapes. (lint)
- MUST pass a single object parameter to any function that takes two or more values. (lint)
- MUST name module-level constants in SCREAMING_SNAKE_CASE. (lint)
- MUST use a `Record` for lookups whose keys are known at design time, such as variant to class name.
- MUST use a `Map` for collections that have entries added or removed at runtime.
- MUST NOT use `enum`. (lint)
- MUST define enum-like values as a SCREAMING_SNAKE_CASE `const` object with SCREAMING_SNAKE_CASE keys and `as const`, in a `.constants.ts` file.
- MUST derive the matching type as `(typeof X)[keyof typeof X]` in a `.types.ts` file, instead of writing a literal union. (lint)

### React

- MUST write function components and hooks. (lint)
- MUST define components and functions with `function` declarations, so files read top-down with the main export first. (lint)
- MUST NOT assign arrow functions or function expressions to `const`, except as inline callbacks. (lint)
- MUST follow the Rules of Hooks and keep components and hooks pure, as the React Compiler requires. (lint)
- MUST keep state local to the component that owns it, in `useState` or `useRef`.
- MUST NOT use global state, including module-level mutable values and context used as a store. (lint) The Supabase client lives in `useSync`'s state, not at module level.
- MUST derive values during render instead of storing them in state.
- MUST use `useEffect` only to sync with something outside React.
- MUST NOT use `useEffect` to derive data or to respond to user events.
- MUST put logic that does not need React in pure `.functions.ts` functions, not in components or hooks.
- MUST pass variants as const-object values, e.g. `variant={BUTTON_VARIANT.OUTLINE}`, never string literals.

### UI components

- MUST style with Tailwind classes.
- MUST NOT use inline styles or new CSS files.
- MUST build UI primitives (Button, Card, Badge, Avatar and so on) as normal components in `src/shared/ui/`, following every rule here.
- MUST map variants to classes with a `Record` in `.constants.ts`.
- MUST NOT use `cva`.
- MUST NOT add shadcn/ui output to `src` as generated: generate a component outside `src`, then port only the parts needed into this structure.

### Tests

- MUST unit test `.functions.ts` files with Vitest, in `__tests__/<file>.functions.test.ts` beside the file. (lint)
- MUST keep Vitest tests to plain functions, with no rendering, DOM, timers or waiting.
- MUST NOT render components or hooks in Vitest.
- MUST test rendering, user interaction and anything time-based with Playwright.
- MUST write Playwright tests per view, at a high level, split by feature into `<View>/__e2e__/<feature>.e2e.test.ts`, e.g. `profile.e2e.test.ts`. (lint)
- MUST import `test` and `expect` from `@e2e/playwrightExtensions`, never from `@playwright/test` directly.
- MUST drive the page through the view's page object (e.g. `fiveLettersPage`) from the fixture.
- MUST NOT use raw `page` locators in tests when a page object method or locator fits.
- MUST put locators, actions and shared assertions on the page object class in `e2e/<view>Page.ts`.
- MUST NOT write classes anywhere except page objects.
- MUST NOT write Playwright tests for individual components.
- MUST limit screenshot snapshots to the launcher plus one board per game in a fixed, in-progress state, desktop project on Linux only.
- MUST assert on roles and text in new tests instead of adding screenshots.
- MUST query the page by role or visible text, falling back to `data-testid` only when there is no meaningful role or text.
- MUST use awaited, auto-retrying web-first assertions on locators, e.g. `await expect(fiveLettersPage.dailyButton).toBeVisible()`. (lint)
- MUST NOT read values out and assert on them, e.g. `expect(await locator.isVisible()).toBe(true)` or `expect(await locator.textContent())`. (lint)
- MUST NOT wait with `waitForTimeout`, `waitForSelector`, `networkidle` or sleeps; wait by asserting on the state you expect. (lint)
- MUST pin the clock with `page.clock` (the fixture does) so daily puzzles are deterministic.
- MUST NOT use `force`, element handles or `page.evaluate` in tests. (lint)
- MUST name page object assertion methods `expect<Something>` and make them await web-first assertions, so lint counts them as assertions.
- MUST NOT use conditionals or `test.skip` in tests; tag platform-only tests with `{ tag: '@desktop' }` or `{ tag: '@mobile' }`. (lint)
- MUST regenerate snapshots with `npm run test:e2e:update` only for intended visual changes.
