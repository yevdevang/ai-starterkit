---
name: playwright-e2e
description: Write and run end-to-end browser tests with Playwright (@playwright/test) for web apps. Use whenever the user asks for e2e tests, end-to-end tests, browser/UI flow tests, Playwright specs, page objects, or to cover a user journey (login, checkout, CRUD) in a real browser, even if they don't say "Playwright".
model: claude-sonnet-5-5
---

# Playwright E2E

Reference: https://playwright.dev/docs/intro

E2E tests exercise the real app through a browser, so they should cover user journeys that unit tests cannot (routing, forms, persistence, integration between components). Keep them few, stable and meaningful.

## Detecting Playwright in a project

- `package.json` has `@playwright/test` in `devDependencies`
- A `playwright.config.ts`/`.js` exists, plus an `e2e/` or `tests/` directory
- If absent, set it up (below). If the project uses Cypress instead, say so and ask before introducing Playwright.

## Setup

```bash
npm init playwright@latest   # or: npm i -D @playwright/test && npx playwright install chromium
```

In `playwright.config.ts`, start the app with `webServer` so tests run unattended:

```ts
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: 'http://localhost:5173', trace: 'on-first-retry' },
  webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: !process.env.CI },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
```

Use the project's real dev command and port (read `package.json`, the framework config); never guess.

## File naming & location

- `e2e/<feature>.spec.ts`, one file per user journey or feature area
- Shared page objects/helpers in `e2e/pages/` or `e2e/fixtures/`, only once two specs need them

## Writing tests

```ts
import { test, expect } from '@playwright/test'

test.describe('todo list', () => {
  test('adds and completes a task', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('textbox', { name: /add task/i }).fill('Buy milk')
    await page.getByRole('button', { name: /add/i }).click()
    const item = page.getByRole('listitem').filter({ hasText: 'Buy milk' })
    await expect(item).toBeVisible()
    await item.getByRole('checkbox').check()
    await expect(item.getByRole('checkbox')).toBeChecked()
  })
})
```

Principles (each exists because it prevents flaky or brittle tests):
- **Locators by user-facing meaning**: prefer `getByRole`, `getByLabel`, `getByText`, `getByTestId`; avoid CSS/XPath tied to markup.
- **Web-first assertions** (`await expect(locator).toBeVisible()`) auto-wait and retry. Never use `waitForTimeout` or sleeps.
- **Independent tests**: each test sets up its own state (fresh context is automatic; clear storage, seed via API, or use `storageState` for auth). No test depends on another's order.
- **Assert outcomes users see**, not implementation details.
- **Stub only the external**: use `page.route()` to mock third-party/unstable APIs, not your own app's backend unless needed.
- Cover happy path plus one or two key failure/edge paths per journey; don't duplicate unit-test coverage.
- Reload to verify persistence when the feature claims to persist (e.g. localStorage).

## Running

Non-watch, CI-style commands (verify they pass before reporting):

```bash
npx playwright test                       # all, headless
npx playwright test e2e/todo.spec.ts      # one file
npx playwright test -g "adds and completes"   # by title
npx playwright test --project=chromium
npx playwright test --ui                  # interactive (local only)
npx playwright show-report                # open HTML report
```

## Debugging failures

1. Read the error and the failing locator; check whether the UI or the test is wrong.
2. `npx playwright test --trace on` then `npx playwright show-trace <trace.zip>`; or `--debug`.
3. Fix the locator/assertion rather than adding waits. If the app is genuinely racy, report it as a bug.
4. Remove any `test.only` / `page.pause()` before finishing.
