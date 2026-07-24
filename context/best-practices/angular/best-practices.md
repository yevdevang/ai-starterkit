# Angular Best Practices

Reference: https://angular.dev/overview

## Components

- Standalone components are the modern default — don't introduce `NgModule`s for new code unless the project is still on the older module-based architecture
- Component class names: `PascalCase` suffixed `Component` (`UserCardComponent`); selectors: kebab-case (`app-user-card`)
- Files: `user-card.component.ts` / `.html` / `.scss`, co-located
- Prefer `OnPush` change detection for new components — pairs naturally with signals and avoids unnecessary re-renders

## State & Reactivity

- **Signals** are the preferred reactivity primitive for component state (`signal()`, `computed()`, `effect()`) — prefer them over manually managed `BehaviorSubject`s for local component state
- **RxJS** remains the right tool for async streams and event composition (HTTP requests, websockets, complex event pipelines, debouncing/throttling) — it isn't being replaced by signals, the two complement each other
- Convert between them at the boundary with `toSignal()` / `toObservable()` rather than mixing subscription-management styles ad hoc

## Control Flow

- Use the built-in control flow syntax (`@if`, `@for`, `@switch`) in templates for new code, not the structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) — it's the modern default and has better type narrowing and performance
- `@for` requires a `track` expression — always provide a stable identifier, not the implicit index

## Dependency Injection

- Prefer the `inject()` function at field-initialization time over constructor-parameter injection for new code — reads better with standalone components and works in more contexts (e.g. functional guards/resolvers)
- Constructor injection is still valid and common in existing codebases — don't churn working code just to switch styles

## Forms

- Reactive Forms (`FormGroup`/`FormControl`) for anything with validation, dynamic fields, or non-trivial logic
- Template-driven forms only for the simplest cases (a couple of fields, no custom validation)

## Component Design

- Favor a smart/presentational split: container components own data-fetching and state, presentational components take `@Input()`s and emit `@Output()`s with no service dependencies of their own — keeps presentational components trivially testable and reusable
- Keep templates free of complex logic — push computation into the component class (or a `computed()` signal) instead of inline template expressions

## TypeScript

- Strict mode on; no `any` — type all `@Input()`/`@Output()` properties and service method signatures explicitly
- Model API responses and domain objects as `interface`s or classes, not inline object literals

## Testing

- See the `jasmine` skill for spec syntax, `TestBed` setup, and spy conventions (Angular's default via Karma)
