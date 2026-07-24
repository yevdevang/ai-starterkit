---
name: fix
description: Manage current bug fix workflow - load, start, investigate, review, test, explain, complete, or run the full loop autonomously
argument-hint: load|start|investigate|review|test|explain|complete|run
---

# Fix Workflow

Manages the full lifecycle of a bug fix from report to merge.

## Working File

@context/current-fix.md

### File Structure

current-fix.md has these sections:

- `# Current Fix` - H1 heading with bug name when active
- `## Status` - Not Started | In Progress | Complete
- `## Problem` - Description of the bug and its symptoms
- `## Root Cause` - Identified cause (filled in during investigate)
- `## Goals` - Bullet points of what a successful fix looks like
- `## Notes` - Additional context, constraints, or details
- `## History` - Completed fixes (append only)

## Task

Execute the requested action: $ARGUMENTS

| Action        | Description                                               |
| ------------- | --------------------------------------------------------- |
| `load`        | Load a bug report or inline description                   |
| `start`       | Begin fixing, create fix branch                           |
| `investigate` | Analyze root cause, identify affected files               |
| `review`      | Check fix is correct, no regressions, no scope creep      |
| `test`        | Write/run tests to verify the fix                         |
| `explain`     | Document what changed and why                             |
| `complete`    | Commit, push, merge, reset                                |
| `run`         | Autonomous loop: investigate → start → implement each goal → test → review → fix → repeat until clean → complete |

See [actions/](actions/) for detailed instructions.

If no action provided, explain the available options.
