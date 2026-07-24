# Phase 3 of 6 — Filtering, Sorting & Counts

Part of the "Beautiful To-Do App" feature (ai-todo-list). Purely additive to Phases 1–2
— no changes to the underlying `Task` model.

## Goals

- All / Active / Completed filter tabs above the task list, driven by a signal
  (`filter: Signal<'all' | 'active' | 'completed'>`)
- A `computed()` signal deriving the filtered list shown to the user from the raw task
  list + current filter — never filter inline in the template
- Footer showing the remaining active-task count ("3 items left")
- "Clear completed" action that removes every completed task in one step
- Optional: a sort toggle (newest/oldest first) by `createdAt`

## Notes

- Filtering state can live in `TaskListComponent` or a small dedicated
  `TaskFilterService` — whichever keeps `TaskListComponent` doing one job, per the
  project's component-focus convention
- Don't touch `TaskService`'s CRUD methods from Phase 1 — this phase only reads and
  derives from the existing task signal
