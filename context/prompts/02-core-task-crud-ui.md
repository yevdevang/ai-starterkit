# Phase 2 of 6 — Core Task CRUD UI

Part of the "Beautiful To-Do App" feature (ai-todo-list). Builds directly on Phase 1's
`TaskService` — no new state management, just UI wired to the existing signals.
Deliberately plain/functional markup — visual polish is Phase 5.

## Goals

- `TaskListComponent` (standalone) rendering tasks from `TaskService` using the `@for`
  control-flow syntax
- Add-task input at the top: typing + Enter (or a button) adds a new task via the
  service
- Each task row: checkbox to toggle complete, task title, delete button
- Inline edit: double-click (or an edit icon) turns the title into an editable field —
  Enter/blur saves, Escape cancels without saving
- Empty state shown when there are no tasks

## Notes

- No changes to the `Task` model or `TaskService`'s public shape from Phase 1 — if this
  phase needs something Phase 1 doesn't expose, extend the service, don't work around it
  in the component
- Keep the component focused — extract subviews (e.g. a `TaskItemComponent`) if
  `TaskListComponent` starts doing more than one job
