# Run Action (autonomous loop)

Chains the other actions into one continuous fix loop — no manual
step-by-step invocation needed. Use when the user wants a bug fixed
end-to-end from an already-loaded report.

1. Read current-fix.md — verify Problem and Goals are populated (same precondition as `start`)
   - If empty, error: "Run /fix load first"
2. Run the `investigate` steps: find affected files, identify root cause, fill in
   ## Root Cause, refine ## Goals if the investigation changed them
3. Run the `start` steps: set Status to "In Progress", create and checkout the fix branch
4. Enter the loop, tracking each Goal as pending / done:
   a. Pick the next pending goal and implement the fix for it
   b. Run the `test` steps — write/run a regression test for the specific bug scenario
   c. Run the `review` steps against everything implemented so far
   d. If review surfaces ❌ missing goals, ⚠️ regressions/quality issues, or 🚫 scope creep:
      - Fix what's in scope, then re-run `review` before moving on
      - A regression found here means the fix itself is wrong — address the root cause,
        don't patch around the symptom
   e. Mark the goal done only once its slice of the review is clean
   f. Repeat until every goal is done and a full `review` pass comes back "Ready to complete"
5. Cap iterations: if the same goal fails review 3 times in a row, stop looping on it and
   surface the blocker to the user instead of continuing indefinitely — a fix that won't
   converge after 3 attempts likely means the root cause in step 2 was wrong, not that the
   next attempt will succeed
6. Run the `test` steps once more as a final full-suite regression check
7. Run the `explain` steps and show the summary to the user
8. Run the `complete` steps (commit, push, merge, reset current-fix.md)
9. Report: root cause, goals implemented, iterations needed per goal (if >1), final test
   results, and the branch that was merged
