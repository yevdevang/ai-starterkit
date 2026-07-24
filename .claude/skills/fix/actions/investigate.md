# Investigate Action

1. Read current-fix.md to understand the problem
2. Search the codebase for files related to the bug (services, models, utilities)
3. Read the relevant files and trace the code path that produces the bug
4. Identify the root cause:
   - Which function or logic is responsible?
   - What incorrect assumption or edge case is it?
   - What is the minimal change that would fix it?
5. Update current-fix.md:
   - Fill in ## Root Cause with a concise explanation
   - Refine ## Goals if needed based on findings
6. Report:
   - Affected files (with line numbers)
   - Root cause summary
   - Proposed fix approach (before writing any code)
