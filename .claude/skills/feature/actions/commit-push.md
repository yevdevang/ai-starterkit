# Commit-Push Action

Verify the code (lint, then tests), and only if everything passes, commit and push to the current
branch's remote. The gate exists so broken code never reaches the remote — if a check fails, stop.

## Arguments
Accepts an optional commit message (e.g. `/feature commit-push "Fix filter bug"`). If omitted, write
one from the diff.

## Steps

1. Preflight:
   - There is something to commit (`git status --porcelain` is not empty); otherwise say so and stop
   - Not mid-merge/rebase, and not in detached HEAD (`git branch --show-current` is not empty)
2. Detect the commands from the project, don't guess: read `package.json` scripts (or the Makefile /
   pyproject / equivalent). Use the package manager the repo already uses (lockfile).
   - Lint: a `lint` script (or the equivalent)
   - Test: a `test` script — run it non-interactively (e.g. `CI=true`, `--run`/`--watch=false`) so it
     exits instead of waiting in watch mode
   If the project has no lint or no test command, say which is missing and continue with the other;
   if it has neither, ask the user whether to proceed unverified instead of silently skipping.
3. Run lint, then tests, in that order (lint is faster, so failures surface sooner).
   - On failure: show the relevant error output, stop, and do not commit or push. Offer to fix the
     problem. Don't bypass with `--no-verify`, skipped tests, or weakened lint rules.
   - Lint auto-fixes (`--fix`) are fine if the repo's lint script already does it, but re-run to
     confirm it's clean.
4. Only after both pass: stage and commit.
   - Stage the intended changes by name or `git add -A` if the whole tree belongs to this work; check
     `git status` first and leave out unrelated files or secrets (`.env`, credentials) — ask if unsure
   - Commit with a descriptive message (imperative, explains why), ending with a blank line and the
     attribution trailer so the commit shows it was created with Claude. Use the exact line from the
     session's commit guidance if there is one; otherwise use
     `Co-Authored-By: Claude <noreply@anthropic.com>`. Pass the message via heredoc so the trailer
     stays on its own line:

     ```bash
     git commit -m "$(cat <<'EOF'
     <message>

     Co-Authored-By: Claude <noreply@anthropic.com>
     EOF
     )"
     ```
5. Push to the current branch's remote, once:
   - Has upstream: `git push`
   - No upstream: `git push -u <remote> HEAD` (`origin` if present, else the first remote)
   - If the push is rejected as non-fast-forward, stop and suggest `/feature fetch` — never force-push
6. Report: lint result, test result (what actually ran), commit hash + message, and the
   remote/branch pushed to.
