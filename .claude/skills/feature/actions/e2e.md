# E2E Action

1. Read `current-feature.md` to understand what was implemented and its Goals
2. Check the project is a web app with a browser UI (`package.json` present and a frontend framework/dev server). If not (e.g. iOS/Swift or a pure library), say e2e does not apply and stop
3. Invoke the `playwright-e2e` skill for setup, conventions, and CLI commands
4. If Playwright is not installed, install and configure it per the skill (use the project's real dev command and port)
5. Identify user journeys that map to the feature's Goals; check for existing specs in `e2e/` and extend them rather than duplicating
6. Write e2e specs for those journeys (happy path plus key edge cases only — leave logic-level coverage to the `test` action)
7. Run `npx playwright test` headless and verify everything passes before reporting
8. Report which Goals are covered by which specs, and anything that could not be automated
