---
name: jest
description: Write and run JavaScript/TypeScript unit tests with Jest (React, Node, general JS/TS projects)
model: claude-sonnet-5-5
---

# Jest

Reference: https://jestjs.io/docs/getting-started

## Detecting Jest in a project

- `package.json` has `jest` in `dependencies`/`devDependencies`, or a `"jest"` key, or a `"test": "jest"` / `"test": "react-scripts test"` script
- A `jest.config.js` / `jest.config.ts` / `jest.config.mjs` file exists
- Create-React-App projects (`react-scripts`) ship Jest by default

## Setup

```bash
npm install --save-dev jest
# TypeScript, pick one:
npm install --save-dev ts-jest @types/jest   # type-checked
npm install --save-dev @babel/preset-typescript @jest/globals  # transpile-only
```

ts-jest only supports TypeScript versions up to its stated peer range, so a bare `npm install typescript` can pull a version it rejects. Install a compatible one (e.g. `typescript@5`) and check the peer range if the first run fails with a version error. With TypeScript 6+, `types` defaults to `[]`, so `expect`/`describe` fail with "Cannot find name"; add `"types": ["jest", "node"]` to `tsconfig.json`.

`package.json`:
```json
{ "scripts": { "test": "jest" } }
```

## File naming & location

- `*.test.js` / `*.test.ts` / `*.test.tsx`, or `*.spec.js`/`.ts`/`.tsx`
- Or anything under a `__tests__/` directory
- Co-locate the test next to the file it covers unless the project has an established `__tests__/` convention

## Basic syntax

```javascript
import { sum } from './sum'

describe('sum', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
```

- `test()` and `it()` are aliases — match whichever the surrounding file already uses
- `describe.each` / `test.each` for table-driven tests
- `test.skip` / `test.only` for temporarily narrowing a run (never leave `.only` committed)

## Common matchers

- Equality: `toBe` (===), `toEqual` (deep), `toStrictEqual` (deep + type/undefined-strict)
- Truthiness: `toBeTruthy`, `toBeFalsy`, `toBeNull`, `toBeUndefined`, `toBeDefined`
- Numbers: `toBeGreaterThan`, `toBeCloseTo` (floats)
- Strings/arrays: `toMatch` (regex), `toContain`, `toHaveLength`
- Exceptions: `toThrow` / `toThrow(SpecificError)`
- Mocks: `toHaveBeenCalled`, `toHaveBeenCalledWith(...)`, `toHaveBeenCalledTimes(n)`
- Negation: prefix any matcher with `.not` — `expect(x).not.toBe(y)`

## Mocking

```javascript
const fn = jest.fn().mockReturnValue(42)

jest.mock('./api')          // auto-mock a module
jest.mock('./api', () => ({ fetchUser: jest.fn() }))  // factory mock

jest.spyOn(obj, 'method').mockImplementation(() => 'stubbed')
```

- Reset mock state between tests: `jest.clearAllMocks()` in `afterEach`, or `clearMocks: true` in config
- Fake timers: `jest.useFakeTimers()` / `jest.advanceTimersByTime(ms)` / `jest.useRealTimers()`

## Async tests

```javascript
test('resolves data', async () => {
  await expect(fetchData()).resolves.toEqual({ ok: true })
})
```

- Always `return` or `await` the assertion for promise-based code — an un-awaited rejection can pass silently

## Setup & teardown

- `beforeEach` / `afterEach` — per test
- `beforeAll` / `afterAll` — once per `describe` block
- Nest `describe` blocks to scope setup to a subset of tests

## Testing React components

- Use `@testing-library/react` alongside Jest (`render`, `screen`, `fireEvent`/`userEvent`)
- Query by role/text/label, not by CSS class or test-implementation detail
- `jest.config.js` needs `testEnvironment: 'jsdom'` for DOM-based component tests

## Running tests

```bash
npm test                          # full suite (via package.json script)
npx jest path/to/file.test.ts     # single file
npx jest -t "adds 1 \+ 2"         # filter by test name (regex: escape + ( ) . etc.)
npx jest --watch                  # watch mode
npx jest --coverage               # coverage report
```
