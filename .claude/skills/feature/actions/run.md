# Run Action (autonomous loop)

Chains the other actions into one continuous development loop — no manual
step-by-step invocation needed. Use when the user wants a feature built
end-to-end from an already-loaded spec.

1. Read current-feature.md — verify Goals are populated (same precondition as `start`)
   - If empty, error: "Run /feature load first"
2. Run the `start` steps: set Status to "In Progress", create and checkout the feature branch
3. Enter the loop, tracking each Goal as pending / done:
   a. Pick the next pending goal and implement it
   b. Run the `test` steps for the code just touched (write/run unit tests where testable logic exists)
   c. Run the `review` steps against everything implemented so far
   d. If review surfaces ❌ missing goals, ⚠️ quality issues, or 🚫 scope creep:
      - Fix what's in scope, then re-run `review` before moving on
      - Scope creep found in your own prior step: remove it, don't rationalize keeping it
   e. Mark the goal done only once its slice of the review is clean
   f. Repeat until every goal is done and a full `review` pass comes back "Ready to complete"
4. Cap iterations: if the same goal fails review 3 times in a row, stop looping on it and
   surface the blocker to the user instead of continuing indefinitely — don't guess past
   genuine ambiguity in the spec
5. Run the `test` steps once more as a final full-suite regression check
6. Run the `explain` steps and show the summary to the user
7. Run the `complete` steps (commit, push, merge, reset current-feature.md)
8. Report: goals implemented, iterations needed per goal (if >1), final test results, and
   the branch that was merged
