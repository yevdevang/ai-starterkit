# Swift Best Practices

Reference: https://developer.apple.com/documentation/swift/

## API Design

- Follow Swift's API Design Guidelines: name things for clarity at the call site, not brevity — `remove(at:)` not `remove(index:)`
- Methods that return a new value without mutating: name as a noun (`sorted()`); mutating counterparts get an imperative verb and `mutating` (`sort()`)
- Boolean properties/methods read as assertions (`isEmpty`, `hasSuffix(_:)`)
- Omit needless words when the type/context already makes them obvious (`array.remove(at: 0)`, not `array.removeElement(atIndex: 0)`)

## Value Types vs. Reference Types

- Default to `struct`/`enum` (value semantics) for models, DTOs, and anything without identity or shared mutable state
- Reach for `class` only when you need reference semantics: shared mutable state, identity comparison, inheritance, or interop with Objective-C/AppKit/UIKit APIs that require it
- Enums with associated values for state that's naturally one-of-several-cases (e.g. `Result<Success, Failure>`-shaped domain state) instead of a struct with several optional/mutually-exclusive properties

## Optionals

- Avoid force-unwrap (`!`) and force-try (`try!`) outside of tests or genuinely-impossible-to-fail invariants — prefer `if let`, `guard let`, or `??`
- `guard let ... else { return }` for early-exit unwrapping at the top of a function, keeping the "happy path" unindented
- Optional chaining (`?.`) over nested `if let` pyramids when just reading a chain of optional properties

## Generics & Protocols

- Prefer protocol-oriented design (protocols + extensions with default implementations) over deep class inheritance hierarchies
- Generic functions/types when the same logic legitimately applies across multiple concrete types — don't generalize prematurely for a single call site
- Constrain generics with `where` clauses / protocol conformance requirements rather than accepting `Any` and casting internally

## Error Handling

- Typed `Error` enums (conforming to `Error`, ideally `LocalizedError` for user-facing messages) instead of stringly-typed errors or `NSError`
- `do/catch` with specific `catch` clauses per error case when the caller needs to branch on failure reason; a single generic `catch` only when any failure is handled identically
- `throws`/`try` for recoverable failures; reserve `fatalError`/force-unwrap-triggered traps for genuine programmer errors that should never happen in a correct build

## Concurrency

- `async`/`await` over completion-handler closures for new asynchronous code
- `actor` (or `@MainActor` for UI-bound state) to protect mutable state shared across concurrency domains, instead of manual locking/dispatch-queue synchronization
- `Task { }` to bridge into async context from synchronous call sites (e.g. a button action); avoid spawning unstructured tasks when a structured `async let` or `TaskGroup` expresses the actual dependency between concurrent operations
- Mark closures/types `Sendable` (or rely on strict-concurrency checking to flag what isn't) rather than silencing warnings — a `Sendable` violation usually points at a real data race

## Collections & Functional Style

- `map`/`filter`/`reduce`/`compactMap` for transforming collections over manual `for` loops with an accumulator, when it doesn't hurt readability
- `compactMap` specifically for "transform and drop nils" in one pass, instead of `map` followed by a separate filter for non-nil
- Lazy sequences (`.lazy`) only when profiling shows the eager intermediate allocations actually matter — don't default to it

## Access Control

- Default to the narrowest access level that works (`private`/`fileprivate` first), widening to `internal`/`public` only when something genuinely needs to be visible outside its file/module
- `private(set)` for properties that should be externally readable but only internally mutable, instead of a separate getter method

## Code Organization

- `// MARK: -` to divide a type's members into logical sections (initializers, public API, private helpers) in larger files
- Extensions to group protocol conformances separately from the primary type declaration (`extension MyType: Codable { ... }`)
