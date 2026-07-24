@co# Release Action

## Arguments
Accepts an optional version number (e.g. `/feature release 1.2.0`).
- If provided, use it as the version.
- If omitted, list existing tags and ask the user to provide the version before continuing.

## Steps

1. Verify current branch is Development (or prompt to switch)
2. Read current-feature.md History to summarize what's included in this release
3. Resolve version:
   - Use the version from arguments if provided
   - Otherwise list existing git tags (`git tag --sort=-v:refname`) and ask the user: "Enter release version (e.g. 1.2.0):"
4. Create and push a release branch named `release/<version>` from Development
5. Merge Development into main and push main
6. Create an annotated git tag `<version>` on main with a short release summary
7. Push the tag
8. Report: version, release branch created, branch merged, and list of features included from History
