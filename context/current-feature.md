# Current Feature: Beautiful To-Do App — Phase 1: Foundation & Task Data Layer

## Status

Complete

## Goals

- Define a `Task` model/interface (`id`, `title`, `completed`, `createdAt`, room to grow) in `src/app/models/`
- Create a `TaskService` (standalone, `providedIn: 'root'`) holding the task list as Angular signal state
- Expose a read-only task signal plus add/update/toggle/remove methods — components never mutate the array directly
- Seed a handful of example tasks for local development
- Establish folder conventions: `src/app/models/`, `src/app/services/`, `src/app/features/tasks/`

## Notes

- Project: `ai-todo-list` (Angular, created via `ng new`, dev server already running at http://localhost:4200/)
- Full feature: "Beautiful To-Do App", broken into 6 phases, one prompt file per phase under `context/prompts/`:
  1. `01-foundation-data-model.md` (this phase)
  2. `02-core-task-crud-ui.md`
  3. `03-filtering-sorting-counts.md`
  4. `04-local-persistence.md`
  5. `05-beautiful-ui-theming.md`
  6. `06-accessibility-polish.md`
- Workflow: complete this phase (`/feature start` → implement → `/feature test`/`review` → `/feature complete`), then `/feature load` the next phase's prompt file's contents and repeat — or use `/feature run` per phase for the autonomous loop
- No UI, styling, or persistence in this phase by design — see the phase's own notes in its prompt file
- Follow `context/best-practices/angular/best-practices.md` and `context/coding-standards.md`'s JS/TS section (signals over manual RxJS for local state, strict typing, no `any`)

## History

### Beautiful To-Do App — Phase 1: Foundation & Task Data Layer

Defined the `Task` model (`src/app/models/task.model.ts`) and a signal-backed
`TaskService` (`src/app/services/task.service.ts`, standalone, `providedIn: 'root'`)
exposing a read-only `tasks` signal plus `addTask`/`updateTask`/`toggleTask`/`removeTask`.
Seeded 3 example tasks. Established `src/app/models/`, `src/app/services/`,
`src/app/features/tasks/` folder conventions. Added unit tests
(`task.service.spec.ts`, 7 cases) — all 9 project tests passing. No UI/persistence
by design; next up is Phase 2 (`02-core-task-crud-ui.md`).
