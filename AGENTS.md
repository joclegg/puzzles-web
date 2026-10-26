# AGENTS.md

Puzzles for the web: eight offline puzzle games served at https://joclegg.github.io/puzzles-web/. Sudoku (classic and killer), Klondike solitaire, Two Tone (a red/blue binary grid), Sightlines (blue dots that count what they see), Five Letters (a word game), Kakuro (cross sums), Slide Out (free the red block) and Word Wheel (swipe letters to fill a crossword). A launcher picks the game.

## Stack

- Vite, React 19, TypeScript 7 (strict). `tsc` is TypeScript 7; the `typescript` package is the TypeScript 6 API, kept only for typescript-eslint. MUST NOT replace it until typescript-eslint supports TypeScript 7.
- Tailwind CSS v4, with components built on Base UI in the shadcn style
- Vitest for unit tests of plain functions
- Playwright for view tests and screenshot snapshots
- ESLint and Prettier

## Commands

- `npm run dev`: start the local dev server
- `npm run lint`: run ESLint
- `npm run format`: format with Prettier
- `npm test`: run the unit tests
- `npm run test:e2e`: build, serve and run the Playwright view tests
- `npm run test:e2e:headed`: run the Playwright tests in a visible, slowed-down browser
- `npm run test:e2e:update`: regenerate the Playwright screenshot snapshots
- `npm run build`: type-check and build to `dist`

## Structure

- `src/main.tsx`: entry point
- `src/views/<View>/`: top-level views, one folder per view
- `src/components/<Component>/`: every other component, one folder per component holding all of its files
- `src/common/`: shared code (random numbers, dates, routing, storage)
- `src/common/<game>/`: every rule of one game as plain functions, with its types, constants and save logic, e.g. `src/common/fiveLetters/`
- `src/assets/`: bundled data such as word lists and puzzle banks
- `public/sudoku/<mode>_<level>/<chunk>.txt`: the Sudoku bank, 250 puzzles per chunk, fetched one chunk at a time so a game loads only what it needs
- `src/views/AppView/`: the hash router that picks the view
- `src/views/<Game><Screen>View/`: one view per game screen, e.g. `FiveLettersHomeView`, `FiveLettersGameView`, `FiveLettersStatsView`, `FiveLettersSettingsView`
- `__tests__/`: Vitest unit tests, next to the files they test
- `src/views/<View>/__e2e__/`: Playwright tests for that view, with screenshots in `__snapshots__`
- `e2e/`: shared Playwright code: `playwrightExtensions.ts` (the `test` fixture) and one page object class per view or game, e.g. `launcherPage.ts`, `fiveLettersPage.ts`

## Rules

Rules marked (lint) are enforced by `npm run lint`.

### General

- MUST keep `npm run lint`, `npm test`, `npm run test:e2e` and `npm run build` passing.
- MUST format code with Prettier.
- MUST import from `src` using the `@/` alias. (lint)
- MUST NOT write comments. (lint)

### Files

- MUST put each top-level view in its own folder, `src/views/<View>/`. (lint)
- MUST put each component in its own folder, `src/components/<Component>/`. (lint)
- MUST name component and view folders and files in PascalCase, matching the folder, e.g. `ThemeToggle/ThemeToggle.hooks.ts`. (lint)
- MUST name files in `src/common` in camelCase, e.g. `random.types.ts`, or in a camelCase game folder, e.g. `fiveLetters/fiveLetters.functions.ts`. (lint)
- MUST split code by kind using file suffixes: `.tsx` for the component, then `.types.ts`, `.constants.ts`, `.functions.ts` and `.hooks.ts`. (lint)
- MAY add a `.worker.ts` Web Worker in `src/common/<game>/` for slow searches, such as the Solitaire solver, so the page stays responsive. (lint)
- MUST define exactly one component per file. (lint)
- MUST NOT define components inside other components. (lint)

### Games

- MUST keep the site fully offline: no network requests, analytics, accounts, ads or cloud sync. Every asset ships with the build.
- MUST keep all player data in the browser, in `localStorage`, through `useStoredState` and `readStored`/`writeStored`, under keys prefixed with the game, e.g. `fiveLetters.games`.
- MUST put every game rule in `src/common/<game>/` as a pure function on that game's state. Views only wire state to those functions.
- MUST NOT import one game's `src/common/<game>/` code from another game.
- MUST draw every random number from `createRandom` in `src/common/random.functions.ts` (XorWow), never `Math.random`, so seeded puzzles are reproducible.
- MUST pick daily puzzles locally and deterministically from the date, so everyone gets the same daily puzzle.
- MUST give every screen except the launcher a back button at the top left.
- MUST put a Settings item in every game's ⋮ menu.
- MUST define each game's colours as CSS variables in `src/index.css`, with a dark value for every token.

### Ordering

- MUST order declarations in a file: exported before non-exported, then `const`s, then types and interfaces, then functions, then alphabetically within each group. (lint, except `const`s)
- MUST put module-level `const`s at the top, below the imports, because they are not hoisted.

### TypeScript

- MUST define parameter and prop types inline and destructure them, e.g. `function clampSlide({ index, count }: { index: number; count: number })`.
- MUST use an `interface` only when the shape is shared by more than one file, and put it in a `.types.ts` file.
- MUST NOT use `type` aliases for object shapes. (lint)
- MUST pass a single object parameter to any function that takes two or more values. (lint)
- MUST name module-level constants in SCREAMING_SNAKE_CASE. (lint)
- MUST use a `Record` for lookups whose keys are known at design time, such as variant to class name.
- MUST use a `Map` for collections that have entries added or removed at runtime.
- MUST NOT use `any`. (lint)
- MUST NOT use `enum`. (lint)
- MUST define enum-like values as a SCREAMING_SNAKE_CASE `const` object with SCREAMING_SNAKE_CASE keys and `as const`, in a `.constants.ts` file.
- MUST derive the matching type as `(typeof X)[keyof typeof X]` in a `.types.ts` file, instead of writing a literal union. (lint)

### React

- MUST write function components. (lint)
- MUST define components and functions with `function` declarations. (lint) Function declarations are hoisted, so files can be ordered top-down, with the main export first and helpers below. `const` functions must be defined before they are used.
- MUST NOT assign arrow functions or function expressions to `const`, except as inline callbacks. (lint)
- MUST keep state local to the component that owns it, in `useState` or `useRef`.
- MUST NOT use global state, including module-level mutable values and context used as a store. (lint)
- MUST derive values during render instead of storing them in state.
- MUST minimise `useEffect`, using it only to sync with something outside React.
- MUST NOT use `useEffect` to derive data or to respond to user events.
- MUST pass variants as const-object values, e.g. `variant={BUTTON_VARIANT.OUTLINE}`, never string literals.

### UI components

- MUST style with Tailwind classes. MUST NOT use inline styles or new CSS files.
- MUST build UI primitives (Button, Card, Badge, Avatar and so on) as normal components in `src/components/<Component>/`, following every rule here.
- MUST map variants to classes with a `Record` in `.constants.ts`. MUST NOT use `cva`.
- MAY use shadcn/ui as a reference: generate a component outside `src`, then port only the parts needed into this structure.

### Tests

- MUST unit test `.functions.ts` files with Vitest, in `__tests__/<file>.functions.test.ts`. (lint)
- MUST keep Vitest tests to plain functions, with no rendering, DOM, timers or waiting.
- MUST NOT render components or hooks in Vitest.
- MUST test rendering, user interaction and anything time-based with Playwright.
- MUST write Playwright tests per view, at a high level, split by feature into `src/views/<View>/__e2e__/<feature>.e2e.test.ts`, e.g. `profile.e2e.test.ts`. (lint)
- MUST import `test` and `expect` from `@e2e/playwrightExtensions`, never from `@playwright/test` directly.
- MUST drive the page through the view's page object (e.g. `fiveLettersPage`) from the fixture. MUST NOT use raw `page` locators in tests when a page object method or locator fits.
- MUST put locators, actions and shared assertions on the page object class in `e2e/<view>Page.ts`. Page object classes are the only place classes are allowed.
- MUST import from `e2e` using the `@e2e/` alias.
- MUST NOT write Playwright tests for individual components.
- MUST take full-page screenshot snapshots of each view state that matters.
- MUST query the page by role or visible text, falling back to `data-testid` only when there is no meaningful role or text.
- MUST use awaited, auto-retrying web-first assertions on locators, e.g. `await expect(fiveLettersPage.dailyButton).toBeVisible()`. (lint)
- MUST NOT read values out and assert on them, e.g. `expect(await locator.isVisible()).toBe(true)` or `expect(await locator.textContent())`. (lint)
- MUST NOT wait with `waitForTimeout`, `waitForSelector`, `networkidle` or sleeps. Wait by asserting on the state you expect. (lint)
- MUST pin the clock with `page.clock` (the fixture does) so daily puzzles are deterministic.
- MUST NOT use `force`, element handles or `page.evaluate` in tests. (lint)
- MUST name page object assertion methods `expect<Something>` and make them await web-first assertions, so lint counts them as assertions.
- MUST NOT use conditionals or `test.skip` in tests. Tag platform-only tests with `{ tag: '@desktop' }` or `{ tag: '@mobile' }`. (lint)
- MUST regenerate snapshots with `npm run test:e2e:update` only for intended visual changes.
