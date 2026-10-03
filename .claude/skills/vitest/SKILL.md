---
name: vitest
model: claude-sonnet-5-5
description: Write and run JavaScript/TypeScript unit tests with Vitest (Vite-based projects — React, Vue, general JS/TS)
---

# Vitest

Reference: https://vitest.dev/guide/

## Detecting Vitest in a project

- `package.json` has `vitest` in `devDependencies`, or a `"test": "vitest"` script
- A `vitest.config.ts`/`.js` file exists, or a `test` block inside `vite.config.ts`
- Vite-based scaffolds (`create-vite`, Vue CLI's Vite template, SvelteKit) default to Vitest over Jest

## Setup

```bash
npm install -D vitest
```

- Requires Vite ≥6 and Node ≥20
- Reads `vite.config.*` automatically — existing Vite plugins (React/Vue/etc.) work in tests with no extra config
- Only add a separate `vitest.config.ts` when test-only settings (environment, globals, coverage) need to diverge from the app's Vite config

`package.json`:
```json
{ "scripts": { "test": "vitest" } }
```

## File naming & location

- Filename must contain `.test.` or `.spec.` (e.g. `sum.test.ts`, `Button.spec.tsx`)
- Co-locate next to the source file it covers, matching the project's existing convention

## Basic syntax

```typescript
import { describe, it, expect } from 'vitest'
import { sum } from './sum'

describe('sum', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
```

- Jest-compatible API by design — `describe`/`it`/`test`/`expect`/`beforeEach`/`afterEach` all work the same
- Set `globals: true` in config to skip the `import { describe, it, expect } from 'vitest'` line project-wide (only if the project already opts into this — don't introduce implicit globals unprompted)
- `it.each` / `describe.each` for table-driven tests

## Common matchers

Same matcher vocabulary as Jest: `toBe`, `toEqual`, `toStrictEqual`, `toBeTruthy`/`toBeFalsy`, `toContain`, `toHaveLength`, `toThrow`, `toMatch`, `.not.<matcher>` negation, plus `toHaveBeenCalledWith` etc. for mocks.

## Mocking

```typescript
import { vi } from 'vitest'

const fn = vi.fn().mockReturnValue(42)

vi.mock('./api', () => ({ fetchUser: vi.fn() }))  // hoisted — runs before imports

vi.spyOn(obj, 'method').mockImplementation(() => 'stubbed')

vi.useFakeTimers()
vi.setSystemTime(new Date('2026-01-01'))
vi.useRealTimers()
```

- `vi.mock()` calls are hoisted to the top of the file by Vitest's transform — factory functions can't reference variables declared later in the file
- Clear/restore mock state between tests: `vi.clearAllMocks()` / `vi.restoreAllMocks()` in `afterEach`, or `clearMocks: true` in config

## Async tests

```typescript
test('resolves data', async () => {
  await expect(fetchData()).resolves.toEqual({ ok: true })
})
```

## Setup & teardown

- `beforeEach` / `afterEach` per test, `beforeAll` / `afterAll` per `describe` block — identical semantics to Jest

## Testing components (React/Vue)

- React: `@testing-library/react`, same query-by-role/text approach as under Jest
- Vue: `@vue/test-utils` + `@testing-library/vue`
- Set `test.environment: 'jsdom'` (or `'happy-dom'`) in the Vitest config for DOM-based component tests

## Workspaces / projects

- Multi-package repos can define a `vitest.workspace.ts` listing each package's config, so `vitest` at the root runs all of them with isolated settings

## Running tests

```bash
npx vitest              # watch mode (default)
vitest run               # single run, no watch — use this in CI / scripted verification
vitest run path/to/file.test.ts   # single file
vitest run -t "adds 1 \+ 2"       # filter by test name (regex: escape + ( ) . etc.)
vitest run --coverage     # coverage report (needs a provider: npm i -D @vitest/coverage-v8)
vitest --ui               # browser-based interactive UI
```

## Key differences from Jest

- Native ESM + Vite transform pipeline — no Babel config needed for TS/JSX
- `vi` instead of `jest` as the mocking namespace (`vi.fn`, `vi.mock`, `vi.spyOn`)
- Watch mode is the default when run bare (`vitest`); use `vitest run` for a one-shot run
- Reuses the project's actual Vite config/plugins, so dev and test environments rarely drift
