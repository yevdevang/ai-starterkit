# Current Feature: Beautiful To-Do App — Phase 2: Core Task CRUD UI

## Status

Complete

## Goals

- `TaskListComponent` (standalone) rendering tasks from `TaskService` using the `@for` control-flow syntax
- Add-task input at the top: typing + Enter (or a button) adds a new task via the service
- Each task row: checkbox to toggle complete, task title, delete button
- Inline edit: double-click (or an edit icon) turns the title into an editable field — Enter/blur saves, Escape cancels without saving
- Empty state shown when there are no tasks

## Notes

- Project: `ai-todo-list` (Angular, created via `ng new`, dev server already running at http://localhost:4200/)
- Full feature: "Beautiful To-Do App", broken into 6 phases, one prompt file per phase under `context/prompts/`:
  1. `01-foundation-data-model.md` (done — see History)
  2. `02-core-task-crud-ui.md` (this phase)
  3. `03-filtering-sorting-counts.md`
  4. `04-local-persistence.md`
  5. `05-beautiful-ui-theming.md`
  6. `06-accessibility-polish.md`
- Workflow: complete this phase (`/feature start` → implement → `/feature test`/`review` → `/feature complete`), then `/feature load` the next phase's prompt file's contents and repeat — or use `/feature run` per phase for the autonomous loop
- Builds directly on Phase 1's `TaskService` — no new state management, just UI wired to the existing signals
- No changes to the `Task` model or `TaskService`'s public shape from Phase 1 — if this phase needs something Phase 1 doesn't expose, extend the service, don't work around it in the component
- Keep the component focused — extract subviews (e.g. a `TaskItemComponent`) if `TaskListComponent` starts doing more than one job
- Deliberately plain/functional markup — visual polish is Phase 5
- Follow `context/best-practices/angular/best-practices.md` and `context/coding-standards.md`'s JS/TS section (signals over manual RxJS for local state, strict typing, no `any`, `@for` with `track`)

## History

### Beautiful To-Do App — Phase 1: Foundation & Task Data Layer

Defined the `Task` model (`src/app/models/task.model.ts`) and a signal-backed
`TaskService` (`src/app/services/task.service.ts`, standalone, `providedIn: 'root'`)
exposing a read-only `tasks` signal plus `addTask`/`updateTask`/`toggleTask`/`removeTask`.
Seeded 3 example tasks. Established `src/app/models/`, `src/app/services/`,
`src/app/features/tasks/` folder conventions. Added unit tests
(`task.service.spec.ts`, 7 cases) — all 9 project tests passing. No UI/persistence
by design; next up is Phase 2 (`02-core-task-crud-ui.md`).

### Beautiful To-Do App — Phase 2: Core Task CRUD UI

Added `TaskItem` (presentational, `src/app/features/tasks/task-item/`) and `TaskList`
(container, `src/app/features/tasks/task-list/`) standalone components. `TaskList`
renders tasks from `TaskService` via `@for`, has an add-task form (Enter or button),
and forwards toggle/remove/rename to the service. `TaskItem` shows a checkbox, title
(double-click to edit inline — Enter/blur saves, Escape cancels), and a delete button.
Empty state shown when there are no tasks. Wired `TaskList` into `App`, replacing the
`ng new` placeholder. No changes to `Task` or `TaskService`'s public shape. Added unit
tests (`task-item.spec.ts` 7 cases, `task-list.spec.ts` 5 cases) — all 21 project tests
passing. Next up is Phase 3 (`03-filtering-sorting-counts.md`).
