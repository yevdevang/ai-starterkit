# E2E Action

1. Read `current-fix.md` to understand what was fixed and its Goals
2. Check the project is a web app with a browser UI (`package.json` present and a frontend framework/dev server). If not (e.g. iOS/Swift or a pure library), say e2e does not apply and stop
3. Invoke the `playwright-e2e` skill for setup, conventions, and CLI commands
4. If Playwright is not installed, install and configure it per the skill (use the project's real dev command and port)
5. Identify the user journey that reproduces the bug; check for existing specs in `e2e/` and extend them rather than duplicating
6. Write a regression e2e spec for that journey: it must fail on the buggy behavior and pass now (happy path plus the edge case that caused the bug only)
7. Run `npx playwright test` headless and verify everything passes before reporting
8. Report the spec covering the bug scenario and its pass result
