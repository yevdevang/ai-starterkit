# Vue Best Practices

Reference: https://vuejs.org/guide/introduction.html

## API Style

- **Composition API with `<script setup>`** is the recommended style for production apps with a build step — use it for all new components
- Options API is acceptable only for no-build-tool / progressive-enhancement scenarios (e.g. a CDN-loaded widget on an otherwise static page) — don't mix styles within the same codebase without a reason
- Both styles share the same underlying reactivity system — Options API is built on Composition API, so this is a style choice, not a capability difference

## Single-File Components

- One component per `.vue` file: `<script setup>`, `<template>`, `<style scoped>` — in that order
- Component file names: `PascalCase` (`UserCard.vue`)
- `<style scoped>` by default — only drop `scoped` when a style is intentionally meant to leak (e.g. a global theme override), and prefer CSS Modules or a naming convention for that instead of an unscoped block

```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button { font-weight: bold; }
</style>
```

## Reactivity

- `ref()` for primitives and values that get reassigned wholesale; access/mutate via `.value` in `<script>`, unwrapped automatically in `<template>`
- `reactive()` for object/array state that's mutated in place rather than reassigned — but note it loses reactivity if destructured, so prefer `ref()` when a value might be pulled out of its container
- `computed()` for derived values instead of recomputing the same expression inline in multiple places in the template
- Lifecycle hooks (`onMounted`, `onUnmounted`, etc.) imported from `vue`, called at the top level of `setup()`/`<script setup>` — same top-level-only rule as React hooks

## Props & Emits

- Declare with `defineProps<{...}>()` / `defineEmits<{...}>()` using TypeScript generics for full type inference — avoid the untyped runtime-only `defineProps({...})` object form in TS projects
- Props are read-only from the child's perspective — emit an event for the parent to update its own state instead of mutating a prop directly

## Composables

- Extract reusable stateful logic into a composable function named `useX` (e.g. `useMousePosition`), mirroring React's custom-hooks convention — a composable is just a function that calls other composition-API functions and returns reactive state

## State Management

- Start with local `ref`/`reactive` state; lift shared state to a common ancestor via props/emits for a small tree
- Reach for **Pinia** once state needs to be shared across distant components or persist across route changes — don't default to a global store for state only one component tree needs

## File Organization

- Group by feature/domain (`features/checkout/CheckoutForm.vue`) once the project outgrows a flat `components/` directory
- Co-locate a component's composables and tests next to it unless the project has an established separate convention

## Testing

- See the `vitest` skill — it's Vue's officially recommended test runner (built on the same Vite pipeline as the app itself)
- Use `@vue/test-utils` + `@testing-library/vue`: query by role/text, not by internal component state
