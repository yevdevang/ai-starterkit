# Phase 4 of 6 — Local Persistence

Part of the "Beautiful To-Do App" feature (ai-todo-list). Persistence stays entirely
inside the service layer — components stay unaware it exists at all.

## Goals

- Persist the task list to `localStorage` on every mutation (add/edit/delete/toggle/
  clear-completed)
- Load persisted tasks on app startup instead of Phase 1's seed data, falling back to
  the seed data only when storage is empty
- Guard every `localStorage` read/write so a corrupted or missing value can't crash the
  app on load — fall back to an empty task list instead
- Debounce writes only if profiling shows a real performance cost — don't add that
  complexity speculatively

## Notes

- Keep persistence logic inside `TaskService`, or delegate to a small dedicated
  `TaskStorageService` it owns — `TaskListComponent` and friends should not know
  `localStorage` is involved
- This phase changes *how* `TaskService`'s state is initialized/saved, not its public
  API — Phases 2–3's components should need zero changes
