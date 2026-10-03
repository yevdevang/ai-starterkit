# PR Action

Open a pull request for the current feature branch using the GitHub CLI (`gh`). Do not use GitHub MCP tools.

## Arguments
Accepts an optional base branch (e.g. `/feature pr main`). Default: the repo's default branch
(`gh repo view --json defaultBranchRef -q .defaultBranchRef.name`).

## Steps

1. Preflight — stop and tell the user if any fails:
   - `gh auth status` succeeds
   - Current branch is not the base branch (never open a PR from main)
   - Working tree is clean (`git status --porcelain`); if not, ask whether to run `complete` first
2. Check for an existing PR: `gh pr view --json url,state 2>/dev/null`. If one is open, report its
   URL and stop — don't create a duplicate.
3. Make sure the branch is on the remote: if no upstream, `git push -u <remote> HEAD`
   (use the remote the repo already uses; `git remote -v`). Otherwise push only if local is ahead.
4. Gather material for the description:
   - `git log <base>..HEAD --oneline` and `git diff <base>...HEAD --stat`
   - `context/current-feature.md` (Goals, Notes) if it has an active feature, else History's latest entry
   - A repo PR template if present (`.github/pull_request_template.md`) — fill it in instead of the default body below
5. Write the title: short, imperative, under 70 chars, derived from the feature name
   (e.g. `Add ai-todo-list Phase 5: beautiful UI, theming & animations`).
6. Write the body (default structure):

   ```
   ## Summary
   - 1–3 bullets on what changed and why

   ## Changes
   - Notable files/areas touched

   ## Test plan
   - [ ] How it was verified (unit/e2e results actually run, manual checks)
   ```

   Only claim tests were run if they were; otherwise leave the box unchecked.
7. Create it, passing the body via heredoc so formatting survives:

   ```bash
   gh pr create --base <base> --title "<title>" --body "$(cat <<'EOF'
   <body>

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

   Add `--draft` if the user asked for a draft.
8. Report the PR URL, base ← head, and title. Do not merge, and don't delete the branch.
