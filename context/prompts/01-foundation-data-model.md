# Phase 1 of 6 — Foundation & Task Data Layer

Part of the "Beautiful To-Do App" feature (ai-todo-list). This phase is deliberately
UI-free — it settles the data contract so every later phase builds on a stable
foundation instead of a moving target.

## Goals

- Define a `Task` model/interface (`id`, `title`, `completed`, `createdAt`, and room to
  grow — e.g. `priority`/`dueDate` later) in a dedicated `src/app/models/` file
- Create a `TaskService` (standalone, `providedIn: 'root'`) that holds the task list as
  Angular signal state — no NgRx/external store, signals are sufficient at this scale
- Expose a read-only signal for the task list plus methods to add / update / toggle /
  remove tasks; components must never mutate the underlying array directly
- Seed a handful of example tasks so the UI has something to render once Phase 2 exists
- Establish the app's folder conventions going forward: `src/app/models/`,
  `src/app/services/`, `src/app/features/tasks/`

## Notes

- Follow `context/best-practices/angular/best-practices.md` — signals for local state,
  strict typing, no `any`
- No components, no styling, no persistence in this phase — just the model and the
  service, so Phase 2 can wire a UI to something that already works
