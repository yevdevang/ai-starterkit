# Test Action

1. Read `current-feature.md` to understand what was implemented
2. Detect the project's stack and route accordingly:
   - `package.json` present at the project root → JavaScript/TypeScript project, go to **JS/TS path** below
   - `.xcodeproj`/`.xcworkspace`/`Package.swift` present, no `package.json` → iOS/Swift project, go to **Swift path** below
   - Neither, or ambiguous → ask the user which test framework/toolchain the project uses before proceeding

## JS/TS path

1. Identify which test framework the project uses, in order:
   - `package.json` `devDependencies`/`dependencies`: `vitest` → Vitest; `jasmine`/`karma-jasmine`/`jasmine-core` → Jasmine; `jest` → Jest
   - Config files: `vitest.config.*` or a `test` block in `vite.config.*` → Vitest; `karma.conf.js` with `frameworks: ['jasmine']` → Jasmine; `jest.config.*` → Jest
   - Angular project (`angular.json` present) with no explicit override → Jasmine (Angular CLI's default via Karma)
   - React project with no `vitest`/`jest` dependency but `react-scripts` present → Jest (bundled with Create React App)
   - If still ambiguous, ask the user rather than guessing
2. Load the matching skill for framework-specific syntax, config, and CLI conventions:
   - Vitest → invoke the `vitest` skill
   - Jasmine → invoke the `jasmine` skill
   - Jest → invoke the `jest` skill
3. Identify services, components, hooks, and utility functions added/modified for this feature
4. Check if tests already exist for these (co-located `*.spec`/`*.test` files, or the project's existing test directory)
5. For code without tests that has testable logic, write unit tests following the loaded framework skill's conventions:
   - Focus on pure logic, services, hooks, and state — not markup/styling
   - Test happy path and error/edge cases
   - Do not write tests just to write them — use your best judgement
6. Run the tests via the framework skill's non-watch CLI invocation (verify pass before reporting)
7. Report test coverage for the new feature code


