# Fetch Action

Bring the latest changes from the integration branch into the current feature branch: fetch, then
merge. Never push, and never touch the integration branch itself.

## Arguments
Accepts an optional source branch (e.g. `/feature fetch dev`). If omitted, auto-detect it.

## Steps

1. Preflight — stop and tell the user if any fails:
   - Current branch is not the source branch (merging a branch into itself is meaningless)
   - Not mid-merge/rebase (`git status` shows no in-progress operation)
   - Working tree is clean (`git status --porcelain`). If not, ask whether to commit
     (`complete` without the push) or stash first. Merging over uncommitted work risks losing it.
2. Pick the remote: `origin` if present, else the first from `git remote`.
3. Fetch: `git fetch <remote> --prune`.
4. Resolve the source branch. If the user named one, use it (error if `<remote>/<name>` doesn't exist).
   Otherwise take the first that exists as `<remote>/<name>`, in this order:
   `main`, `master`, `dev`, `development`.
   If more than one exists, say which one was chosen and why (first in priority order) so the user can
   re-run with an explicit branch. If none exist, list `git branch -r` and stop.
5. Check what's incoming: `git log HEAD..<remote>/<source> --oneline`. If empty, report
   "already up to date with <source>" and stop.
6. Merge: `git merge <remote>/<source> --no-edit`. Use a merge, not a rebase — the branch may already
   be pushed, and rewriting its history would force a force-push.
7. If conflicts occur:
   - List them with `git diff --name-only --diff-filter=U`
   - Resolve them if the right answer is clear from both sides (keep both features' intent); for
     real ambiguity, ask the user instead of guessing — a wrong silent resolution is worse than a pause
   - Finish with `git add <files>` and `git commit --no-edit`
   - If the user prefers to bail out, `git merge --abort` restores the pre-merge state
8. Sanity-check the result: if the project has a quick build/test command, run it and report the
   outcome honestly; don't claim it passes unless it ran.
9. Report: source branch merged, number of incoming commits, whether conflicts were resolved
   (and in which files), and that nothing was pushed. Suggest `complete` or a push when ready.
