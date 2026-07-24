# Test Action

1. Read `current-fix.md` to understand what was fixed
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
3. Identify services, components, hooks, and utility functions added/modified for this fix
4. Check if tests already exist for these (co-located `*.spec`/`*.test` files, or the project's existing test directory)
5. For code without tests that has testable logic, write a regression test following the loaded framework skill's conventions:
   - Focus on the specific bug scenario, not general coverage
   - Test happy path and the edge case that caused the bug
   - Do not write tests just to write them — focus on covering the fixed logic
6. Run the tests via the framework skill's non-watch CLI invocation (verify pass before reporting)
7. Report test results and confirm the bug scenario is now covered

## Swift path

1. Identify services, ViewModels, and utility functions added/modified for this fix
2. Check if tests already exist for these in the project's `*Tests/` directory
3. For functions without tests that have testable logic, write unit tests:
   - Use XCTest framework
   - Focus on the specific bug scenario (regression test)
   - Test happy path and the edge case that caused the bug
   - For `@MainActor` services: use `async setUp/tearDown` with initialization delay
   - For singletons: call `reset()` in both `setUp()` and `tearDown()` to prevent state leakage
   - Do not write tests just to write them — focus on covering the fixed logic
4. Run tests to verify they pass:
   ```bash
   xcodebuild test -scheme <Scheme> -destination 'platform=iOS Simulator,name=<Simulator>'
   ```
   To run only the new test class:
   ```bash
   xcodebuild test -scheme <Scheme> -destination 'platform=iOS Simulator,name=<Simulator>' -only-testing:<Target>/<TestClassName>
   ```
5. Report test results and confirm the bug scenario is now covered
