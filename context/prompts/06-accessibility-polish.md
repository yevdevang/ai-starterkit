# Phase 6 of 6 — Accessibility & Final Polish

Part of the "Beautiful To-Do App" feature (ai-todo-list). Closing phase — no new
features, only correctness, inclusivity, and regression-safety on everything built in
Phases 1–5.

## Goals

- Full keyboard support: add, toggle, edit, delete, and filter tasks without a mouse
- ARIA labels/roles for icon-only buttons (delete, edit) and the filter tabs
- Focus management: sensible tab order, visible focus states, focus moves into the
  inline-edit field when it opens and returns sensibly when it closes
- Check color contrast on the Phase 5 theme (both light and dark) against WCAG AA
- Unit tests (Vitest — see the `vitest` skill) for `TaskService`'s CRUD/filtering logic
  and the Phase 4 persistence guard behavior (corrupted/missing storage doesn't crash
  load)

## Notes

- If an accessibility fix requires a markup change from Phase 2/3, make it — this phase
  can touch earlier phases' files, unlike Phases 2–5 which were additive-only
- This is also the natural point to run `/feature test` and `/feature review` across the
  whole feature, not just this phase's changes
