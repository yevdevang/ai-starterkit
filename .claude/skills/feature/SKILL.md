---
name: feature
description: Manage current feature workflow - start, review, explain, complete, lint+test then commit and push, fetch latest main/dev changes, release, or run the full loop autonomously
argument-hint: load|start|review|test|e2e|explain|complete|commit-push|fetch|pr|release|run
model: claude-sonnet-5-5
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

@context/current-feature.md

### File Structure

current-feature.md has these sections:

- `# Current Feature` - H1 heading with feature name when active
- `## Status` - Not Started | In Progress | Complete
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec
- `## History` - Completed features (append only)

## Task

Execute the requested action: $ARGUMENTS

| Action     | Description                                               |
| ---------- | --------------------------------------------------------- |
| `load`     | Load a feature spec or inline description                 |
| `start`    | Begin implementation, create branch                       |
| `review`   | Check goals met, code quality                             |
| `test`     | Check for testable logic for server actions and utilities |
| `e2e`      | Write and run Playwright end-to-end tests for the feature |
| `explain`  | Document what changed and why                             |
| `complete` | Commit, push, merge, reset                                |
| `commit-push [message]` | Run lint and tests; only if both pass, commit and push to the current remote branch |
| `fetch [branch]` | Fetch and merge latest main/master/dev/development into the current branch |
| `pr [base]` | Create a pull request for the current branch via `gh` CLI |
| `release [version]` | Create release branch, merge → main, tag version |
| `run`      | Autonomous loop: start → implement each goal → test → review → fix → repeat until clean → complete |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.