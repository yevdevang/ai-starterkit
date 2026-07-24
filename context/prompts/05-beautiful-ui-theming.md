# Phase 5 of 6 — Beautiful UI, Theming & Animations

Part of the "Beautiful To-Do App" feature (ai-todo-list). This is the phase where
"beautiful" actually gets delivered — Phases 1–4 were deliberately plain/functional so
this pass has a stable, fully-working app to restyle rather than styling a moving
target.

## Goals

- Full visual design pass: a typography scale, a spacing system, and a cohesive color
  palette expressed as named design tokens (CSS custom properties), not magic hex values
  scattered through templates
- Light/dark theme, toggleable and persisted (alongside tasks, via the Phase 4
  persistence approach)
- Micro-animations: task add/remove transitions, a checkbox toggle animation, smooth
  filter-tab switching
- Responsive layout — comfortable on mobile widths as well as desktop
- Visually polish the empty state and any loading state (functionally present since
  Phase 2, now made to look intentional)

## Notes

- No new task-management behavior in this phase — every interaction already works from
  Phases 1–4; this phase only changes how it looks and feels
- Prefer real CSS transitions/animations over a heavy animation library for effects this
  small
