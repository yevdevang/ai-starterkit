# React Best Practices

Reference: https://react.dev/learn

## Components

- One component per responsibility — extract subviews aggressively rather than growing one component
- Component names: `PascalCase`, files match the component (`UserCard.tsx`)
- Compose small components into larger ones (composition over inheritance/prop-drilling workarounds)
- Keep render output pure — no side effects, no mutating props/state, no network calls during render itself

## Props vs. State

- **Props**: read-only data passed down from a parent — never mutate a prop inside the child
- **State** (`useState`): local data that changes over time and drives re-renders
- **Lifting state up**: when two components need the same state, move it to their closest common parent and pass it down via props, rather than duplicating it or reaching for global state prematurely
- Derive values from existing state/props during render instead of storing them as separate state (avoids state getting out of sync)

## Hooks

- Hooks (`useX`) only at the top level of a component or custom hook — never inside conditions, loops, or nested functions
- Custom hooks: extract reusable stateful logic, name them `useX`, and they may call other hooks
- `useEffect` is for synchronizing with external systems (subscriptions, DOM APIs, non-React widgets) — not a general-purpose "run this after render" hook. If you're deriving state or responding to a prop change, do it during render or in an event handler instead
- `useMemo`/`useCallback`/`React.memo`: reach for these only after profiling shows a real re-render cost — don't wrap everything speculatively

## Lists & Keys

- `array.map()` for rendering lists; every item needs a stable, unique `key` (an ID, not the array index unless the list is static and never reordered)

## JSX

- Close every tag; wrap sibling elements in a single parent (`<div>` or `<>...</>`)
- `className`, not `class`
- Event handlers passed by reference: `onClick={handleClick}`, never `onClick={handleClick()}`
- Conditionals use plain JavaScript (`&&`, ternary, early return) — no special JSX conditional syntax

## State Management

- Start with local component state; lift up when siblings need to share it; reach for React Context only for genuinely cross-cutting concerns (theme, auth, current user)
- Bring in an external store (Redux, Zustand, Jotai, etc.) only once local state + Context stop scaling — don't default to one on day one

## TypeScript

- Type props explicitly via an `interface`/`type`, never `any`
- Prefer `type` for unions/props shapes used only for typing; `interface` when the shape may be extended
- Type hook return values and custom hook signatures explicitly when inference isn't obvious

## File Organization

- Co-locate a component's tests and styles next to the component file unless the project has an established separate `__tests__`/`styles` convention
- Group by feature/domain rather than by file type (`features/checkout/CheckoutForm.tsx`, not a global `components/` dumping ground) once the project outgrows a flat structure

## Testing

- See the `jest` or `vitest` skill (whichever the project uses) for framework mechanics
- Use `@testing-library/react`: query by role/text/label, not by CSS class or internal state — test what the user sees, not implementation details
