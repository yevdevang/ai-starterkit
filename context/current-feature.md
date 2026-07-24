# Current Feature: Beautiful To-Do App — Phase 3: Filtering, Sorting & Counts

## Status

Complete

## Goals

- All / Active / Completed filter tabs above the task list, driven by a signal (`filter: Signal<'all' | 'active' | 'completed'>`)
- A `computed()` signal deriving the filtered list shown to the user from the raw task list + current filter — never filter inline in the template
- Footer showing the remaining active-task count ("3 items left")
- "Clear completed" action that removes every completed task in one step
- Optional: a sort toggle (newest/oldest first) by `createdAt`

## Notes

- Project: `ai-todo-list` (Angular, created via `ng new`, dev server already running at http://localhost:4200/)
- Full feature: "Beautiful To-Do App", broken into 6 phases, one prompt file per phase under `context/prompts/`:
  1. `01-foundation-data-model.md` (done — see History)
  2. `02-core-task-crud-ui.md` (done — see History)
  3. `03-filtering-sorting-counts.md` (this phase)
  4. `04-local-persistence.md`
  5. `05-beautiful-ui-theming.md`
  6. `06-accessibility-polish.md`
- Workflow: complete this phase (`/feature start` → implement → `/feature test`/`review` → `/feature complete`), then `/feature load` the next phase's prompt file's contents and repeat — or use `/feature run` per phase for the autonomous loop
- Purely additive to Phases 1–2 — no changes to the `Task` model
- Don't touch `TaskService`'s CRUD methods from Phase 1 — this phase only reads and derives from the existing task signal; "Clear completed" can be done by calling the existing `removeTask` once per completed task
- Filtering state can live in `TaskList` or a small dedicated `TaskFilterService` — whichever keeps `TaskList` doing one job, per the project's component-focus convention
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

### Beautiful To-Do App — Phase 3: Filtering, Sorting & Counts

Added `TaskFilterService` (`src/app/services/task-filter.service.ts`, standalone,
`providedIn: 'root'`) holding `filter` (`all`/`active`/`completed`) and `sortOrder`
(`newest`/`oldest`) signal state. Added presentational `TaskFilterTabs` and `TaskFooter`
components (inputs/outputs only, no service deps). `TaskList` gained `computed()` signals
— `visibleTasks` (filtered + sorted), `activeCount`, `emptyMessage` — and a
`clearCompleted()` method that calls the existing `removeTask` once per completed task.
No changes to `Task` or `TaskService`'s CRUD methods. Added unit tests
(`task-filter.service.spec.ts` 3 cases, `task-filter-tabs.spec.ts` 4,
`task-footer.spec.ts` 3, plus 5 new `task-list.spec.ts` cases) — all 36 project tests
passing. Next up is Phase 4 (`04-local-persistence.md`).
